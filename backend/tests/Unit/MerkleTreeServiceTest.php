<?php

namespace Tests\Unit;

use App\Models\MerkleLeaf;
use App\Services\MerkleTreeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MerkleTreeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected MerkleTreeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        // Override height for testing to keep it fast
        config(['app.merkle_tree_height' => 4]);
        putenv('MERKLE_TREE_HEIGHT=4');
        $this->service = new MerkleTreeService();
    }

    /**
     * Test mathematical correctness of the generated Merkle Proof.
     */
    public function test_merkle_proof_mathematical_correctness()
    {
        // 1. Insert 3 mock commitment hashes (leaves)
        $leaves = [
            'hash_voter_0' => hash('sha256', 'voter0_secret'),
            'hash_voter_1' => hash('sha256', 'voter1_secret'),
            'hash_voter_2' => hash('sha256', 'voter2_secret'),
        ];

        $index = 0;
        foreach ($leaves as $name => $hash) {
            MerkleLeaf::create([
                'leaf_index' => $index++,
                'leaf_hash' => $hash,
            ]);
        }

        // 2. Fetch path for Voter 1 (index 1)
        $voter1Hash = $leaves['hash_voter_1'];
        $proof = $this->service->getMerklePath($voter1Hash);

        $this->assertNotNull($proof);
        $this->assertEquals(1, $proof['leaf_index']);
        $this->assertCount(4, $proof['path_elements']); // Height 4
        $this->assertCount(4, $proof['path_indices']);

        // 3. Mathematically verify the proof:
        // Hash the leaf with its siblings level by level and check if it yields the root.
        $currentHash = $voter1Hash;
        $pathElements = $proof['path_elements'];
        $pathIndices = $proof['path_indices'];

        for ($d = 0; $d < count($pathElements); $d++) {
            $sibling = $pathElements[$d];
            $direction = $pathIndices[$d]; // 0 if left, 1 if right child

            if ($direction === 0) {
                // Current node is left child, sibling is right
                $currentHash = $this->service->hashNodes($currentHash, $sibling);
            } else {
                // Sibling is left child, current node is right
                $currentHash = $this->service->hashNodes($sibling, $currentHash);
            }
        }

        // Assert the computed root matches the root returned by the proof
        $this->assertEquals($proof['root'], $currentHash);
    }
}
