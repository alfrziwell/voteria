<?php

namespace App\Http\Controllers;

use App\Http\Resources\MerklePathResource;
use App\Services\MerkleTreeService;
use Illuminate\Http\JsonResponse;

class MerkleController extends Controller
{
    protected MerkleTreeService $merkleTreeService;

    public function __construct(MerkleTreeService $merkleTreeService)
    {
        $this->merkleTreeService = $merkleTreeService;
    }

    /**
     * Get the Merkle Path (siblings and directions) for the given voter commitment hash.
     */
    public function getMerklePath(string $hash): JsonResponse
    {
        $proof = $this->merkleTreeService->getMerklePath($hash);

        if (!$proof) {
            return response()->json([
                'message' => 'Commitment hash not found in Merkle Tree.',
            ], 404);
        }

        return response()->json([
            'data' => new MerklePathResource($proof),
        ]);
    }
}
