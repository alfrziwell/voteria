<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateElectionSettingRequest;
use App\Http\Resources\ElectionSettingResource;
use App\Models\ElectionSetting;
use Illuminate\Http\JsonResponse;

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
                'election_name' => 'Pemilihan Umum Raya BEM',
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
                'election_name' => 'Pemilihan Umum Raya BEM',
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
}
