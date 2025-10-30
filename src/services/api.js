import axios from 'axios';
import SecurityUtils from '../utils/security.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with maximum security configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // Reduced timeout for better security
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  },
  // Additional security options
  withCredentials: false, // Prevent credential leakage
  maxRedirects: 0, // Prevent redirect attacks
  validateStatus: (status) => status >= 200 && status < 300 // Strict status validation
});

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
  if (typeof data === 'string') {
    return SecurityUtils.sanitizeInput(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeRequestData);
  }
  
  if (typeof data === 'object' && data !== null) {
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
  async getUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Comedians
  async getComedians() {
    try {
      const response = await apiClient.get('/comedians');
      return response.data;
    } catch (error) {
      console.error('Error fetching comedians:', error);
      throw error;
    }
  },

  async getComedianById(id) {
    try {
      const response = await apiClient.get(`/comedians/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comedian with id ${id}:`, error);
      throw error;
    }
  },

  // Venues
  async getVenues() {
    try {
      const response = await apiClient.get('/venues');
      return response.data;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  },

  // Groups
  async getGroups() {
    try {
      const response = await apiClient.get('/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  // Feedback
  async submitFeedback(feedbackData) {
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
};