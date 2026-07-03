<?php

namespace App\Http\Controllers;

use App\Http\Resources\ElectionSettingResource;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Get live election statistics for the admin dashboard.
     */
    public function getStats(): JsonResponse
    {
        $totalVoters = Voter::count();
        $votedCount = Voter::where('has_voted', true)->count();
        $participationPercentage = $totalVoters > 0 ? round(($votedCount / $totalVoters) * 100, 2) : 0.0;

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
            'data' => [
                'total_registered_voters' => $totalVoters,
                'voted_count' => $votedCount,
                'participation_percentage' => $participationPercentage,
                'election_settings' => new ElectionSettingResource($settings),
            ]
        ]);
    }
}
