<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateElectionSettingRequest;
use App\Http\Resources\ElectionSettingResource;
use App\Models\ElectionSetting;
use App\Services\BlockchainService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    /**
     * Get the current active election settings.
     */
    public function show(): JsonResponse
    {
        $settings = ElectionSetting::first();

        // Seed default settings if database is empty
        if (!$settings) {
            $settings = ElectionSetting::create([
                'election_name' => 'Pemilihan Suara Umum BEM',
                'start_time' => now(),
                'end_time' => now()->addDays(2),
                'smart_contract_address' => '0x0000000000000000000000000000000000000000',
                'is_active' => true,
            ]);
        }

        return response()->json([
            'data' => new ElectionSettingResource($settings),
        ]);
    }

    /**
     * Update the election settings.
     */
    public function update(UpdateElectionSettingRequest $request): JsonResponse
    {
        $settings = ElectionSetting::first();

        if (!$settings) {
            $settings = ElectionSetting::create(array_merge([
                'election_name' => 'Pemilihan Suara Umum BEM',
                'start_time' => now(),
                'end_time' => now()->addDays(2),
                'smart_contract_address' => '0x0000000000000000000000000000000000000000',
                'is_active' => true,
            ], $request->validated()));
        } else {
            $settings->update($request->validated());
        }

        return response()->json([
            'message' => 'Election settings updated successfully',
            'data' => new ElectionSettingResource($settings),
        ]);
    }

    /**
     * Submit a vote via the backend relayer.
     * Receives ZKP proof from the frontend and broadcasts the transaction to the blockchain.
     */
    public function submitVote(Request $request): JsonResponse
    {
        $request->validate([
            'proof' => 'required|array',
            'proof.a' => 'required|array',
            'proof.b' => 'required|array',
            'proof.c' => 'required|array',
            'candidateId' => 'required|integer',
            'nullifierHash' => 'required|string',
        ]);

        try {
            $blockchainService = new BlockchainService();

            $txHash = $blockchainService->castVote(
                $request->input('proof'),
                $request->input('candidateId'),
                $request->input('nullifierHash')
            );

            // Mark the authenticated voter as having voted in the database
            $voter = $request->user();
            if ($voter) {
                $voter->update(['has_voted' => true]);
            }

            return response()->json([
                'message' => 'Vote submitted successfully',
                'transaction_hash' => $txHash,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit vote: ' . $e->getMessage(),
            ], 500);
        }
    }
}
