import axios from 'axios';

// Base URL for the JSON server
const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service object
export const apiService = {
  // Comedians API
  comedians: {
    getAll: () => api.get('/comedians'),
    getById: (id) => api.get(`/comedians/${id}`),
    create: (comedian) => api.post('/comedians', comedian),
    update: (id, comedian) => api.put(`/comedians/${id}`, comedian),
    delete: (id) => api.delete(`/comedians/${id}`),
  },

  // Venues API
  venues: {
    getAll: () => api.get('/venues'),
    getById: (id) => api.get(`/venues/${id}`),
    create: (venue) => api.post('/venues', venue),
    update: (id, venue) => api.put(`/venues/${id}`, venue),
    delete: (id) => api.delete(`/venues/${id}`),
  },

  // Groups API
  groups: {
    getAll: () => api.get('/groups'),
    getById: (id) => api.get(`/groups/${id}`),
    create: (group) => api.post('/groups', group),
    update: (id, group) => api.put(`/groups/${id}`, group),
    delete: (id) => api.delete(`/groups/${id}`),
  },

  // Messages API
  messages: {
    getAll: () => api.get('/messages'),
    getById: (id) => api.get(`/messages/${id}`),
    getByUserId: (userId) => api.get(`/messages?from_id=${userId}&to_id=${userId}`),
    send: (message) => api.post('/messages', message),
    markAsRead: (id) => api.patch(`/messages/${id}`, { read: true }),
    delete: (id) => api.delete(`/messages/${id}`),
  },

  // Reviews API
  reviews: {
    getAll: () => api.get('/reviews'),
    getByVenueId: (venueId) => api.get(`/reviews?venue_id=${venueId}`),
    getByComedianId: (comedianId) => api.get(`/reviews?comedian_id=${comedianId}`),
    create: (review) => api.post('/reviews', review),
    update: (id, review) => api.put(`/reviews/${id}`, review),
    delete: (id) => api.delete(`/reviews/${id}`),
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      let message = 'An error occurred';
      
      switch (status) {
        case 404:
          message = 'Resource not found';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 403:
          message = 'Access denied';
          break;
        default:
          message = error.response.data?.message || 'An error occurred';
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

export default apiService;