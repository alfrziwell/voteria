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
   * Submit/relay vote transaction to the backend relayer.
   * The backend will sign and submit the transaction to the blockchain.
   * @param {Object} voteData
   * @param {Object} voteData.proof ZK-SNARK Groth16 proof object containing a, b, c, inputs
   * @param {number} voteData.candidateId The ID of the candidate being voted for
   * @param {string} voteData.nullifierHash The generated nullifier hash to prevent double voting
   */
  async submitVote(voteData) {
    try {
      // Sends a JSON object containing { proof, candidateId, nullifierHash } to the Laravel API Relayer endpoint
      const response = await axiosClient.post('/election/submit-vote', {
        proof: voteData.proof,
        candidateId: voteData.candidateId,
        nullifierHash: voteData.nullifierHash
      });
      return response;
    } catch (error) {
      console.error('Error submitting vote to relayer:', error);
      throw error;
    }
  }
};
