import axiosClient from '../axiosClient';

/**
 * Service to manage active election parameters and vote status updates.
 */
export const electionService = {
  /**
   * Fetch current election status, times, name, and blockchain smart contract address.
   * @returns {Promise<{id: number, election_name: string, start_time: string, end_time: string, smart_contract_address: string, is_active: boolean}>}
   */
  async getElectionStatus() {
    try {
      const response = await axiosClient.get('/election/settings');
      // Returns raw resource: response.data
      return response.data || response;
    } catch (error) {
      console.error('Error fetching election settings:', error);
      throw error;
    }
  },

  /**
   * Submit/relay vote transaction status update.
   * Updates the voter's has_voted status after a successful blockchain transaction.
   * In a relayer model, voteData may also include proof params (a, b, c) and inputs.
   * @param {Object} voteData
   * @param {string} [voteData.commitment_hash] Voter's Merkle commitment leaf hash
   * @param {Array} [voteData.proof] (Optional) ZK-SNARK Groth16 proof parameter array
   * @param {Array} [voteData.inputs] (Optional) ZK-SNARK public signals array
   */
  async submitVote(voteData) {
    try {
      const response = await axiosClient.post('/voter/voted', voteData);
      return response;
    } catch (error) {
      console.error('Error submitting vote status callback:', error);
      throw error;
    }
  }
};
