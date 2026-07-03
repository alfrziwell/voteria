import axiosClient from '../axiosClient';

/**
 * Authentication service for voter login and logout.
 */
export const authService = {
  /**
   * Log in voter using NIM and password.
   * Stores the Sanctum token in localStorage on success.
   * @param {string} nim
   * @param {string} password
   */
  async login(nim, password) {
    try {
      const response = await axiosClient.post('/login', { nim, password });
      
      // Save details to localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_role', 'voter');
        localStorage.setItem('voter_data', JSON.stringify(response.voter));
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Log out voter, revoking token in the backend.
   * Purges credentials from localStorage.
   */
  async logout() {
    try {
      const response = await axiosClient.post('/logout');
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('voter_data');
    }
  },

  /**
   * Retrieve cached voter data from storage.
   */
  getCurrentVoter() {
    const voter = localStorage.getItem('voter_data');
    return voter ? JSON.parse(voter) : null;
  },

  /**
   * Check if voter session is active.
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token') && localStorage.getItem('user_role') === 'voter';
  }
};
