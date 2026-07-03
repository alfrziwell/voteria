import axiosClient from '../axiosClient';

/**
 * Service to fetch candidate data.
 */
export const candidateService = {
  /**
   * Fetch all registered election candidates.
   */
  async getCandidates() {
    try {
      const response = await axiosClient.get('/candidates');
      // Returns raw resource array: response.data
      return response.data || response;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  /**
   * Fetch details for a specific candidate.
   * @param {number|string} id
   */
  async getCandidateById(id) {
    try {
      const response = await axiosClient.get(`/candidates/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching candidate details for ID ${id}:`, error);
      throw error;
    }
  }
};
