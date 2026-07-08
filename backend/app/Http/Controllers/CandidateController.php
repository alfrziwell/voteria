<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Http\Resources\CandidateResource;
use App\Models\Candidate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

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
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('candidates', 'public');
            $validated['photo_url'] = '/storage/' . $path;
        }

        // Remove 'photo' key from validated since it's not a db column
        unset($validated['photo']);

        $candidate = Candidate::create($validated);

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
     * Accepts both PUT (JSON) and POST (multipart/form-data for file uploads).
     */
    public function update(\Illuminate\Http\Request $request, int $id): JsonResponse
    {
        $candidate = Candidate::findOrFail($id);

        $rules = [
            'candidate_number' => ['sometimes', 'integer', 'unique:candidates,candidate_number,' . $id],
            'chairman_name'    => ['sometimes', 'string', 'max:255'],
            'vice_chairman_name' => ['sometimes', 'string', 'max:255'],
            'vision'           => ['sometimes', 'string'],
            'mission'          => ['sometimes', 'string'],
            'photo'            => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
        ];

        $validated = $request->validate($rules);

        if ($request->hasFile('photo')) {
            // Delete old photo if it exists and starts with /storage/
            if ($candidate->photo_url && str_starts_with($candidate->photo_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $candidate->photo_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('candidates', 'public');
            $validated['photo_url'] = '/storage/' . $path;
        }

        // Remove 'photo' key from validated since it's not a db column
        unset($validated['photo']);

        $candidate->update($validated);

        return response()->json([
            'message' => 'Candidate updated successfully',
            'data'    => new CandidateResource($candidate),
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
