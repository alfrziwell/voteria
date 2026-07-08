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
  },

  /**
   * Add a new candidate (Admin only).
   * @param {Object} candidateData
   */
  async addCandidate(candidateData) {
    try {
      const response = await axiosClient.post('/candidates', candidateData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  },

  /**
   * Update an existing candidate (Admin only).
   * @param {number|string} id
   * @param {Object} candidateData
   */
  async updateCandidate(id, candidateData) {
    try {
      // Always POST for file upload support (backend has POST /candidates/{id} route)
      const response = await axiosClient.post(`/candidates/${id}`, candidateData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating candidate with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a candidate (Admin only).
   * @param {number|string} id
   */
  async deleteCandidate(id) {
    try {
      const response = await axiosClient.delete(`/candidates/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting candidate with ID ${id}:`, error);
      throw error;
    }
  }
};
