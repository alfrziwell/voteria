import axiosClient from '../axiosClient';

/**
 * Service to manage administrator operations and dashboard configurations.
 */
export const adminService = {
  /**
   * Log in admin using username and password.
   * Stores the Sanctum token in localStorage on success.
   * @param {string} username
   * @param {string} password
   */
  async adminLogin(username, password) {
    try {
      const response = await axiosClient.post('/admin/login', { username, password });
      
      // Save details to localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('admin_data', JSON.stringify(response.admin));
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in as admin:', error);
      throw error;
    }
  },

  /**
   * Log out admin, revoking token in the backend.
   * Purges credentials from localStorage.
   */
  async adminLogout() {
    try {
      const response = await axiosClient.post('/admin/logout');
      return response;
    } catch (error) {
      console.error('Error logging out admin:', error);
      throw error;
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('admin_data');
    }
  },

  /**
   * Fetch live statistics for the admin dashboard (registered, voted, percentage).
   * @returns {Promise<{total_registered_voters: number, voted_count: number, participation_percentage: number, election_settings: Object}>}
   */
  async getDashboardStats() {
    try {
      const response = await axiosClient.get('/admin/dashboard/stats');
      // Returns raw resource: response.data
      return response.data || response;
    } catch (error) {
      console.error('Error fetching admin dashboard statistics:', error);
      throw error;
    }
  },

  /**
   * Update the voting active status (open/close election).
   * Serves as off-chain state toggle.
   * @param {boolean} isActive
   * @returns {Promise<Object>} The updated election settings
   */
  async toggleElectionStatus(isActive) {
    try {
      const response = await axiosClient.post('/admin/election/toggle', { is_active: isActive });
      return response.data || response;
    } catch (error) {
      console.error('Error toggling election status:', error);
      throw error;
    }
  }
};
