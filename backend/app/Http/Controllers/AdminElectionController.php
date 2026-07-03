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
                'smart_contract_address' => '0x0000000000000000000000000000000000000000',
                'is_active' => $request->is_active,
            ]);
        } else {
            $settings->update([
                'is_active' => $request->is_active
            ]);
        }

        return response()->json([
            'message' => 'Election voting status updated successfully',
            'data' => new ElectionSettingResource($settings),
        ]);
    }
}
