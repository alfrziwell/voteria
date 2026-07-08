<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleElectionStatusRequest;
use App\Http\Resources\ElectionSettingResource;
use App\Models\ElectionSetting;
use Illuminate\Http\JsonResponse;

class AdminElectionController extends Controller
{
    /**
     * Toggle the is_active status of the election.
     * Serves as backend reflection for smart contract toggle.
     */
    public function toggleElectionStatus(ToggleElectionStatusRequest $request): JsonResponse
    {
        $settings = ElectionSetting::first();

        if (!$settings) {
            $settings = ElectionSetting::create([
                'election_name' => 'Pemilihan Suara Umum BEM',
                'start_time' => now(),
                'end_time' => now()->addDays(2),
                'smart_contract_address' => env('SMART_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
                'is_active' => $request->is_active,
            ]);
        } else {
            $settings->update([
                'is_active' => $request->is_active
            ]);
        }

        // Sync with the Smart Contract on the blockchain
        try {
            $blockchainService = new \App\Services\BlockchainService();
            $contractActive = $blockchainService->isVotingActive();

            if ($contractActive !== $request->is_active) {
                $blockchainService->toggleVotingStatus();
            }

            // If we are opening the election, sync the Merkle Root as well
            if ($request->is_active) {
                $merkleTreeService = new \App\Services\MerkleTreeService();
                $tree = $merkleTreeService->buildTree();
                $height = (int) env('MERKLE_TREE_HEIGHT', 20);
                $root = $tree[$height][0] ?? null;

                if ($root) {
                    if (!str_starts_with($root, '0x')) {
                        $root = '0x' . $root;
                    }
                    $blockchainService->setMerkleRoot($root);
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to sync election status with blockchain: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Election voting status updated successfully',
            'data' => new ElectionSettingResource($settings),
        ]);
    }
}
