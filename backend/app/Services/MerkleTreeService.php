<?php

namespace App\Services;

use App\Models\MerkleLeaf;
use InvalidArgumentException;

class MerkleTreeService
{
    protected int $height;
    protected string $defaultLeafHash;
    protected array $zeroHashes = [];

    public function __construct()
    {
        $this->height = (int) env('MERKLE_TREE_HEIGHT', 20);
        $this->defaultLeafHash = hash('sha256', '0');
        $this->precomputeZeroHashes();
    }

    /**
     * Precompute zero hashes for each level of the tree.
     */
    protected function precomputeZeroHashes(): void
    {
        $this->zeroHashes[0] = $this->defaultLeafHash;
        for ($i = 1; $i <= $this->height; $i++) {
            $this->zeroHashes[$i] = $this->hashNodes($this->zeroHashes[$i - 1], $this->zeroHashes[$i - 1]);
        }
    }

    /**
     * Compute parent node hash from left and right child hashes.
     */
    public function hashNodes(string $left, string $right): string
    {
        return hash('sha256', $left . $right);
    }

    /**
     * Get the entire active Merkle Tree up to the root.
     * Returns an array of layers, where layer 0 is the leaves.
     */
    public function buildTree(): array
    {
        $activeLeaves = MerkleLeaf::orderBy('leaf_index')
            ->pluck('leaf_hash', 'leaf_index')
            ->toArray();

        $tree = [];
        $tree[0] = $activeLeaves;

        for ($d = 0; $d < $this->height; $d++) {
            $tree[$d + 1] = [];
            foreach ($tree[$d] as $idx => $val) {
                $parentIdx = (int)($idx / 2);
                if (array_key_exists($parentIdx, $tree[$d + 1])) {
                    continue;
                }
                $leftIdx = $parentIdx * 2;
                $rightIdx = $parentIdx * 2 + 1;
                $left = $tree[$d][$leftIdx] ?? $this->zeroHashes[$d];
                $right = $tree[$d][$rightIdx] ?? $this->zeroHashes[$d];
                $tree[$d + 1][$parentIdx] = $this->hashNodes($left, $right);
            }
        }

        return $tree;
    }

    /**
     * Get the Merkle Path (proof) for a given leaf hash.
     */
    public function getMerklePath(string $commitmentHash): ?array
    {
        $leaf = MerkleLeaf::where('leaf_hash', $commitmentHash)->first();

        if (!$leaf) {
            return null;
        }

        $leafIndex = (int) $leaf->leaf_index;
        $tree = $this->buildTree();

        $pathElements = [];
        $pathIndices = [];
        $currentIndex = $leafIndex;

        for ($d = 0; $d < $this->height; $d++) {
            $siblingIndex = $currentIndex % 2 === 0 ? $currentIndex + 1 : $currentIndex - 1;
            $siblingHash = $tree[$d][$siblingIndex] ?? $this->zeroHashes[$d];

            $pathElements[] = $siblingHash;
            $pathIndices[] = $currentIndex % 2;

            $currentIndex = (int)($currentIndex / 2);
        }

        $root = $tree[$this->height][0] ?? $this->zeroHashes[$this->height];

        return [
            'leaf' => $commitmentHash,
            'leaf_index' => $leafIndex,
            'path_elements' => $pathElements,
            'path_indices' => $pathIndices,
            'root' => $root,
        ];
    }
}
