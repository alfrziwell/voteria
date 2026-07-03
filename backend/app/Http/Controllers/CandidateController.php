<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Http\Resources\CandidateResource;
use App\Models\Candidate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CandidateController extends Controller
{
    /**
     * Display a listing of candidates.
     */
    public function index(): AnonymousResourceCollection
    {
        return CandidateResource::collection(Candidate::orderBy('candidate_number')->get());
    }

    /**
     * Store a newly created candidate.
     */
    public function store(StoreCandidateRequest $request): JsonResponse
    {
        $candidate = Candidate::create($request->validated());

        return response()->json([
            'message' => 'Candidate created successfully',
            'data' => new CandidateResource($candidate),
        ], 201);
    }

    /**
     * Display the specified candidate.
     */
    public function show(int $id): JsonResponse
    {
        $candidate = Candidate::findOrFail($id);

        return response()->json([
            'data' => new CandidateResource($candidate),
        ]);
    }

    /**
     * Update the specified candidate.
     */
    public function update(UpdateCandidateRequest $request, int $id): JsonResponse
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->update($request->validated());

        return response()->json([
            'message' => 'Candidate updated successfully',
            'data' => new CandidateResource($candidate),
        ]);
    }

    /**
     * Remove the specified candidate.
     */
    public function destroy(int $id): JsonResponse
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();

        return response()->json([
            'message' => 'Candidate deleted successfully',
        ]);
    }
}
