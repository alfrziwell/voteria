import axiosClient from '../axiosClient';

/**
 * Service to fetch voter-specific relational data.
 */
export const voterService = {
  /**
   * Get the current authenticated voter's profile.
   */
  async getVoterProfile() {
    try {
      const response = await axiosClient.get('/voter/profile');
      // Returns raw resource: response.voter
      return response.voter || response;
    } catch (error) {
      console.error('Error fetching voter profile:', error);
      throw error;
    }
  },

  /**
   * Fetch all registered voters (Admin only).
   */
  async getVoters() {
    try {
      const response = await axiosClient.get('/voters');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching voters:', error);
      throw error;
    }
  },

  /**
   * Register a new voter (Admin only).
   */
  async addVoter(voterData) {
    try {
      const response = await axiosClient.post('/voters', voterData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding voter:', error);
      throw error;
    }
  }
};
