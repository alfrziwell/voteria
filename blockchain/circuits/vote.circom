pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

/**
 * Helper template to hash left and right child nodes based on the path direction.
 * If selector is 0: hash(left, right) -> left child is currentHash, right is sibling.
 * If selector is 1: hash(right, left) -> sibling is left child, currentHash is right.
 */
template HashLeftRight() {
    signal input left;
    signal input right;
    signal input selector; // 0 = left child, 1 = right child
    signal output hash;

    // Multiplexer constraints to decide inputs based on selector
    signal in0;
    signal in1;

    in0 <== left + selector * (right - left);
    in1 <== right + selector * (left - right);

    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== in0;
    poseidon.inputs[1] <== in1;

    hash <== poseidon.out;
}

/**
 * VoteProof Circuit
 * Proves that a voter belongs to the registered voter Merkle Tree
 * and computes a unique nullifier hash to prevent double-voting.
 */
template VoteProof(k) {
    // Private Inputs
    signal input secret;
    signal input nullifier;
    signal input pathElements[k];
    signal input pathIndices[k];

    // Public Inputs
    signal input merkleRoot;

    // Output
    signal output nullifierHash;

    // 1. Compute voter's leaf commitment = Poseidon(secret, nullifier)
    component commitmentHasher = Poseidon(2);
    commitmentHasher.inputs[0] <== secret;
    commitmentHasher.inputs[1] <== nullifier;
    signal commitment;
    commitment <== commitmentHasher.out;

    // 2. Compute unique public nullifier hash = Poseidon(nullifier, nullifier)
    // Used on-chain to mark the voter as having voted without revealing their identity.
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== nullifier;
    nullifierHasher.inputs[1] <== nullifier;
    nullifierHash <== nullifierHasher.out;

    // 3. Traversal up the Merkle Tree
    component hashers[k];
    signal currentHash[k + 1];
    currentHash[0] <== commitment;

    for (var i = 0; i < k; i++) {
        // Enforce pathIndices[i] is binary (0 or 1)
        pathIndices[i] * (pathIndices[i] - 1) === 0;

        hashers[i] = HashLeftRight();
        hashers[i].left <== currentHash[i];
        hashers[i].right <== pathElements[i];
        hashers[i].selector <== pathIndices[i];

        currentHash[i + 1] <== hashers[i].hash;
    }

    // 4. Enforce that computed root equals the public input root
    currentHash[k] === merkleRoot;
}

// Instantiate the circuit with tree height 20 (up to ~1M voters)
component main {public [merkleRoot]} = VoteProof(20);
