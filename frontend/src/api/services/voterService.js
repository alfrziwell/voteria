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
  }
};
