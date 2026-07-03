<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\VoterResource;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate voter and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $voter = Voter::where('nim', $request->nim)->first();

        if (!$voter || !Hash::check($request->password, $voter->password)) {
            throw ValidationException::withMessages([
                'nim' => ['NIM or password is incorrect.'],
            ]);
        }

        $token = $voter->createToken('voter_session')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'voter' => new VoterResource($voter),
        ]);
    }

    /**
     * Get the authenticated voter profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'voter' => new VoterResource($request->user()),
        ]);
    }

    /**
     * Log the voter out and revoke tokens.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}
