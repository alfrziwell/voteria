<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Database\Seeders\AdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed default admin accounts
        $this->seed(AdminSeeder::class);
    }

    /**
     * Test admin authentication lifecycle, stats retrieval, and election toggle.
     */
    public function test_admin_features_flow()
    {
        // 1. Admin login with correct credentials
        $loginResponse = $this->postJson('/api/admin/login', [
            'username' => 'rektor',
            'password' => 'rektor123',
        ]);

        $loginResponse->assertStatus(200);
        $loginResponse->assertJsonStructure([
            'message',
            'token',
            'admin' => ['id', 'name', 'username', 'role']
        ]);

        $token = $loginResponse->json('token');
        $this->assertEquals('rektor', $loginResponse->json('admin.username'));
        $this->assertEquals('rektor', $loginResponse->json('admin.role'));

        // Admin login with wrong credentials
        $badLoginResponse = $this->postJson('/api/admin/login', [
            'username' => 'rektor',
            'password' => 'wrongpassword',
        ]);
        $badLoginResponse->assertStatus(422);

        // 2. Fetch Dashboard Statistics
        // Seed some voters first to ensure stats count correctly
        Voter::create([
            'nim' => '1202200001',
            'name' => 'Voter One',
            'faculty' => 'IT',
            'password' => 'voterpwd123',
            'commitment_hash' => 'hash1',
            'has_voted' => true,
        ]);

        Voter::create([
            'nim' => '1202200002',
            'name' => 'Voter Two',
            'faculty' => 'IT',
            'password' => 'voterpwd123',
            'commitment_hash' => 'hash2',
            'has_voted' => false,
        ]);

        $statsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/dashboard/stats');

        $statsResponse->assertStatus(200);
        $statsResponse->assertJson([
            'data' => [
                'total_registered_voters' => 2,
                'voted_count' => 1,
                'participation_percentage' => 50.0,
            ]
        ]);

        // 3. Toggle Election Active Status
        $toggleResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/election/toggle', [
            'is_active' => false,
        ]);

        $toggleResponse->assertStatus(200);
        $toggleResponse->assertJsonPath('data.is_active', false);

        // Verify in database
        $this->assertDatabaseHas('election_settings', [
            'is_active' => false,
        ]);

        // Toggle back to true
        $toggleTrueResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/election/toggle', [
            'is_active' => true,
        ]);

        $toggleTrueResponse->assertStatus(200);
        $toggleTrueResponse->assertJsonPath('data.is_active', true);

        // Verify in database
        $this->assertDatabaseHas('election_settings', [
            'is_active' => true,
        ]);

        // 4. Admin Logout
        $logoutResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/logout');

        $logoutResponse->assertStatus(200);
        $logoutResponse->assertJson(['message' => 'Admin logout successful']);

        auth()->forgetGuards();

        // Requesting stats after logout should fail
        $statsResponseAfterLogout = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/dashboard/stats');

        $statsResponseAfterLogout->assertStatus(401);
    }
}
