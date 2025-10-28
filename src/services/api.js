// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3001';

export const apiService = {
  // Comedian endpoints
  getComedians: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comedians`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching comedians:', error);
      throw error;
    }
  },

  // Venue endpoints
  getVenues: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/venues`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  },

  // Group endpoints
  getGroups: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  // User endpoints
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Feedback endpoints
  submitFeedback: async (feedbackData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackData,
          timestamp: new Date().toISOString(),
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },
};