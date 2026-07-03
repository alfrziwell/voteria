<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoterRequest;
use App\Http\Requests\UpdateVoterRequest;
use App\Http\Resources\VoterResource;
use App\Models\MerkleLeaf;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VoterController extends Controller
{
    /**
     * Display a listing of voters.
     */
    public function index(): AnonymousResourceCollection
    {
        return VoterResource::collection(Voter::orderBy('nim')->get());
    }

    /**
     * Store a newly created voter (registration).
     */
    public function store(StoreVoterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $secret = null;

        DB::beginTransaction();
        try {
            if (empty($validated['commitment_hash'])) {
                // Generate secret: 32-character hexadecimal string
                $secret = bin2hex(random_bytes(16));
                $validated['commitment_hash'] = hash('sha256', $validated['nim'] . $secret);
            }

            $validated['password'] = Hash::make($validated['password']);
            $voter = Voter::create($validated);

            // Add commitment hash as a new leaf in the Merkle Tree
            $leafIndex = MerkleLeaf::count();
            MerkleLeaf::create([
                'leaf_index' => $leafIndex,
                'leaf_hash' => $validated['commitment_hash'],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Voter registered successfully',
                'data' => new VoterResource($voter),
                'secret' => $secret, // Only returned on registration so the voter can save it
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to register voter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified voter.
     */
    public function show(int $id): JsonResponse
    {
        $voter = Voter::findOrFail($id);

        return response()->json([
            'data' => new VoterResource($voter),
        ]);
    }

    /**
     * Update the specified voter.
     */
    public function update(UpdateVoterRequest $request, int $id): JsonResponse
    {
        $voter = Voter::findOrFail($id);
        $validated = $request->validated();

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        DB::beginTransaction();
        try {
            // If commitment hash is changed, update the Merkle Tree leaf
            if (isset($validated['commitment_hash']) && $validated['commitment_hash'] !== $voter->commitment_hash) {
                $leaf = MerkleLeaf::where('leaf_hash', $voter->commitment_hash)->first();
                if ($leaf) {
                    $leaf->update(['leaf_hash' => $validated['commitment_hash']]);
                } else {
                    $leafIndex = MerkleLeaf::count();
                    MerkleLeaf::create([
                        'leaf_index' => $leafIndex,
                        'leaf_hash' => $validated['commitment_hash'],
                    ]);
                }
            }

            $voter->update($validated);
            DB::commit();

            return response()->json([
                'message' => 'Voter updated successfully',
                'data' => new VoterResource($voter),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update voter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified voter.
     */
    public function destroy(int $id): JsonResponse
    {
        $voter = Voter::findOrFail($id);

        DB::beginTransaction();
        try {
            // Delete the corresponding Merkle leaf
            MerkleLeaf::where('leaf_hash', $voter->commitment_hash)->delete();
            $voter->delete();

            // Re-index remaining Merkle leaves to keep indices contiguous
            $leaves = MerkleLeaf::orderBy('id')->get();
            foreach ($leaves as $index => $leaf) {
                $leaf->update(['leaf_index' => $index]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Voter deleted successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete voter: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk import voters.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'voters' => ['required', 'array'],
            'voters.*.nim' => ['required', 'string', 'unique:voters,nim'],
            'voters.*.name' => ['required', 'string', 'max:255'],
            'voters.*.faculty' => ['required', 'string', 'max:255'],
            'voters.*.password' => ['required', 'string', 'min:6'],
        ]);

        $importedVoters = [];

        DB::beginTransaction();
        try {
            $nextLeafIndex = MerkleLeaf::count();

            foreach ($request->voters as $voterData) {
                $secret = bin2hex(random_bytes(16));
                $commitmentHash = hash('sha256', $voterData['nim'] . $secret);

                $voter = Voter::create([
                    'nim' => $voterData['nim'],
                    'name' => $voterData['name'],
                    'faculty' => $voterData['faculty'],
                    'password' => Hash::make($voterData['password']),
                    'commitment_hash' => $commitmentHash,
                ]);

                MerkleLeaf::create([
                    'leaf_index' => $nextLeafIndex++,
                    'leaf_hash' => $commitmentHash,
                ]);

                $importedVoters[] = [
                    'voter' => new VoterResource($voter),
                    'secret' => $secret,
                ];
            }

            DB::commit();

            return response()->json([
                'message' => 'Voters imported successfully',
                'data' => $importedVoters,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to import voters: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update voter's has_voted status.
     * Accessible via callback from frontend after successful blockchain transaction.
     */
    public function updateVotedStatus(Request $request): JsonResponse
    {
        $request->validate([
            'commitment_hash' => ['nullable', 'string', 'exists:voters,commitment_hash'],
        ]);

        $commitmentHash = $request->input('commitment_hash');

        if ($commitmentHash) {
            $voter = Voter::where('commitment_hash', $commitmentHash)->firstOrFail();
        } else {
            // Update currently authenticated voter
            $voter = $request->user();
        }

        if ($voter->has_voted) {
            return response()->json([
                'message' => 'Voter has already voted.',
                'data' => new VoterResource($voter)
            ], 422);
        }

        $voter->update(['has_voted' => true]);

        return response()->json([
            'message' => 'Voter status updated to voted successfully',
            'data' => new VoterResource($voter),
        ]);
    }
}
