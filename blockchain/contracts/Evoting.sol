// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Verifier.sol";

/**
 * @title Evoting
 * @notice Core ledger contract for Voteria's E-Voting system.
 * It manages voting status, candidate votes, voter nullifiers, and validates ZK-SNARK proofs.
 */
contract Evoting {
    // State Variables
    address public admin;
    Verifier public verifier;
    bool public isVotingActive;
    uint256 public currentMerkleRoot;

    // candidateVotes[candidateId] -> voteCount
    mapping(uint256 => uint256) public candidateVotes;

    // usedNullifiers[nullifierHash] -> bool (true if already voted)
    mapping(uint256 => bool) public usedNullifiers;

    // Events
    event VoteCast(uint256 indexed candidateId, uint256 indexed nullifierHash);
    event MerkleRootUpdated(uint256 oldRoot, uint256 newRoot);
    event VotingStatusToggled(bool isActive);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Evoting: Only admin can call this function");
        _;
    }

    modifier votingActive() {
        require(isVotingActive, "Evoting: Voting window is currently closed");
        _;
    }

    /**
     * @notice Constructor to initialize Verifier and Admin.
     * @param _verifierAddress Address of the Groth16 Verifier contract.
     */
    constructor(address _verifierAddress) {
        require(_verifierAddress != address(0), "Evoting: Verifier address cannot be zero");
        admin = msg.sender;
        verifier = Verifier(_verifierAddress);
        isVotingActive = false; // Closed by default
    }

    /**
     * @notice Updates the current Merkle Root. Only admin can execute.
     * @param _root The new Merkle Root value.
     */
    function setMerkleRoot(uint256 _root) external onlyAdmin {
        emit MerkleRootUpdated(currentMerkleRoot, _root);
        currentMerkleRoot = _root;
    }

    /**
     * @notice Opens or closes the voting period. Only admin can execute.
     */
    function toggleVotingStatus() external onlyAdmin {
        isVotingActive = !isVotingActive;
        emit VotingStatusToggled(isVotingActive);
    }

    /**
     * @notice Casts an anonymous vote using a Groth16 ZK-SNARK membership proof.
     * @param a Proof parameters a
     * @param b Proof parameters b
     * @param c Proof parameters c
     * @param input Public inputs from circuit: input[0] is the merkleRoot
     * @param candidateId ID of the candidate being voted for
     * @param nullifierHash The voter's unique nullifier hash
     */
    function castVote(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[1] calldata input,
        uint256 candidateId,
        uint256 nullifierHash
    ) external votingActive {
        // 1. Assert that the proof's Merkle Root matches the on-chain current root
        require(input[0] == currentMerkleRoot, "Evoting: Proof is generated for a stale or invalid Merkle Root");

        // 2. Assert that the voter has not voted before (prevent double-voting)
        require(!usedNullifiers[nullifierHash], "Evoting: This vote nullifier has already been spent");

        // 3. Verify ZK-SNARK Proof of Membership
        // The Verifier takes the proof and the public inputs [merkleRoot, nullifierHash]
        uint256[2] memory verifierInput = [input[0], nullifierHash];
        bool isProofValid = verifier.verifyProof(a, b, c, verifierInput);
        require(isProofValid, "Evoting: Invalid zero-knowledge membership proof");

        // 4. Record nullifier as spent to prevent double-voting
        usedNullifiers[nullifierHash] = true;

        // 5. Increment candidate votes
        candidateVotes[candidateId] += 1;

        // 6. Emit vote event for audit trails
        emit VoteCast(candidateId, nullifierHash);
    }
}
