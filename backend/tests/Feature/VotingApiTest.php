<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\MerkleLeaf;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VotingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Keep tree small for testing speed
        putenv('MERKLE_TREE_HEIGHT=4');
        config(['app.merkle_tree_height' => 4]);
    }

    /**
     * Test the entire API flow: Candidate CRUD, Voter Registration, Login, Merkle Path, and Voted Status.
     */
    public function test_entire_voting_backend_flow()
    {
        // 1. Get empty candidates list
        $response = $this->getJson('/api/candidates');
        $response->assertStatus(200)->assertJsonCount(0, 'data');

        // 2. Add candidates (since it's protected, we need authentication, let's create a voter first)
        $registerResponse = $this->postJson('/api/voters', [
            'nim' => '1202200001',
            'name' => 'Alif Alfarizi',
            'faculty' => 'School of Computing',
            'password' => 'secretpassword123',
        ]);

        $registerResponse->assertStatus(201);
        $registerResponse->assertJsonStructure([
            'message',
            'data' => ['id', 'nim', 'name', 'faculty', 'commitment_hash', 'has_voted'],
            'secret'
        ]);

        $commitmentHash = $registerResponse->json('data.commitment_hash');
        $secret = $registerResponse->json('secret');

        $this->assertNotEmpty($commitmentHash);
        $this->assertNotEmpty($secret);

        // Verify the commitment hash is correct: hash(nim + secret)
        $this->assertEquals(hash('sha256', '1202200001' . $secret), $commitmentHash);

        // Verify the MerkleLeaf was created
        $this->assertDatabaseHas('merkle_leaves', [
            'leaf_index' => 0,
            'leaf_hash' => $commitmentHash,
        ]);

        // 3. Login using NIM and Password
        $loginResponse = $this->postJson('/api/login', [
            'nim' => '1202200001',
            'password' => 'secretpassword123',
        ]);

        $loginResponse->assertStatus(200);
        $loginResponse->assertJsonStructure([
            'message',
            'token',
            'voter'
        ]);

        $token = $loginResponse->json('token');

        // 4. Test candidates list retrieval (public)
        // Add candidate to database manually for testing public show/index
        $candidate = Candidate::create([
            'candidate_number' => 1,
            'chairman_name' => 'Candidate Chairman 1',
            'vice_chairman_name' => 'Candidate Vice Chairman 1',
            'vision' => 'To make a better campus.',
            'mission' => 'Work hard.',
            'photo_url' => 'https://example.com/photo1.jpg',
        ]);

        $response = $this->getJson('/api/candidates');
        $response->assertStatus(200)->assertJsonCount(1, 'data');

        // 5. Test protected route: Get profile
        $profileResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/voter/profile');

        $profileResponse->assertStatus(200);
        $profileResponse->assertJsonPath('voter.nim', '1202200001');

        // 6. Test protected route: Get Merkle Path
        $pathResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/merkle/path/' . $commitmentHash);

        $pathResponse->assertStatus(200);
        $pathResponse->assertJsonStructure([
            'data' => [
                'leaf',
                'leaf_index',
                'path_elements',
                'path_indices',
                'root'
            ]
        ]);

        $this->assertEquals(0, $pathResponse->json('data.leaf_index'));
        $this->assertCount(4, $pathResponse->json('data.path_elements'));

        // 7. Test protected route: Callback to update voted status
        $votedResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/voter/voted', [
            'commitment_hash' => $commitmentHash,
        ]);

        $votedResponse->assertStatus(200);
        $votedResponse->assertJsonPath('data.has_voted', true);

        // Verify database is updated
        $this->assertDatabaseHas('voters', [
            'nim' => '1202200001',
            'has_voted' => true,
        ]);

        // Attempting to vote again should fail
        $votedAgainResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/voter/voted', [
            'commitment_hash' => $commitmentHash,
        ]);

        $votedAgainResponse->assertStatus(422);
    }
}
