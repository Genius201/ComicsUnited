
import axios from 'axios';
import SecurityUtils from '../utils/security.js';

// Helper to get Vite env base URL (only in browser/Vite)
let viteApiBaseUrl;
function getViteApiBaseUrl() {
  // Only in browser/Vite: dynamically import viteApiBaseUrl.js
  if (typeof window === 'undefined') {
    // Node/Jest: never reference import.meta
    return undefined;
  }
  if (viteApiBaseUrl !== undefined) {
    return viteApiBaseUrl;
  }
  try {
    // Dynamically require viteApiBaseUrl.js (only in browser)
    // eslint-disable-next-line global-require
    viteApiBaseUrl = require('./viteApiBaseUrl.js').default;
    return viteApiBaseUrl;
  } catch (e) {
    return undefined;
  }
}

// Main API client factory
export function createApiClient(baseURL) {
  let resolvedBaseURL = baseURL;
  if (!resolvedBaseURL) {
    // Try Vite env (browser only)
    resolvedBaseURL = getViteApiBaseUrl();
  }
  if (!resolvedBaseURL) {
    resolvedBaseURL = 'http://localhost:3001';
  }
  return axios.create({
    baseURL: resolvedBaseURL,
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    },
    withCredentials: false,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 300
  });
}

// Default client for app usage
const apiClient = createApiClient();


// Request interceptor for security
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = SecurityUtils.secureStorage.get('csrf_token');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      config.data = sanitizeRequestData(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Sanitize request data recursively
function sanitizeRequestData(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeRequestData(value);
    }
    return sanitized;
  }
  return data;
}


export const apiService = {
  // Users
  users: {
    async getAll() {
      try {
        const response = await apiClient.get('/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    async create(userData) {
      try {
        const response = await apiClient.post('/users', userData);
        return response.data;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    }
  },
  // Comedians
  comedians: {
    async getAll() {
      try {
        const response = await apiClient.get('/comedians');
        return response.data;
      } catch (error) {
        console.error('Error fetching comedians:', error);
        throw error;
      }
    },
    async getById(id) {
      try {
        const response = await apiClient.get(`/comedians/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching comedian with id ${id}:`, error);
        throw error;
      }
    }
  },
  // Venues
  venues: {
    async getAll() {
      try {
        const response = await apiClient.get('/venues');
        return response.data;
      } catch (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
    },
    async getById(id) {
      try {
        const response = await apiClient.get(`/venues/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching venue with id ${id}:`, error);
        throw error;
      }
    },
    async getByState(state) {
      try {
        const response = await apiClient.get(`/venues?state=${state}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching venues for state ${state}:`, error);
        throw error;
      }
    }
  },
  // Groups
  groups: {
    async getAll() {
      try {
        const response = await apiClient.get('/groups');
        return response.data;
      } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }
    }
  },
  // Feedback
  feedback: {
    async submit(feedbackData) {
      try {
        const response = await apiClient.post('/feedback', {
          ...feedbackData,
          timestamp: new Date().toISOString(),
        });
        return response.data;
      } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }
    }
  }
};