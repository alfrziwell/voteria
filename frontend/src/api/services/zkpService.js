import axiosClient from '../axiosClient';

/**
 * Service to manage Zero-Knowledge Proof (ZKP) inputs.
 */
export const zkpService = {
  /**
   * Fetch Merkle siblings and path indices for a given voter commitment hash.
   * This is critical input data required to generate zk-SNARK proofs locally.
   * @param {string} commitmentHash The voter's leaf commitment hash
   * @returns {Promise<{leaf: string, leaf_index: number, path_elements: string[], path_indices: number[], root: string}>}
   */
  async getMerklePath(commitmentHash) {
    try {
      const response = await axiosClient.get(`/merkle/path/${commitmentHash}`);
      // Returns raw resource: response.data
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching Merkle path for commitment ${commitmentHash}:`, error);
      throw error;
    }
  }
};
