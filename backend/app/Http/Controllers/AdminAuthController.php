<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminLoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Authenticate admin and return token.
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username or password is incorrect.'],
            ]);
        }

        $token = $admin->createToken('admin_session')->plainTextToken;

        return response()->json([
            'message' => 'Admin login successful',
            'token' => $token,
            'admin' => new AdminResource($admin),
        ]);
    }

    /**
     * Log the admin out and revoke tokens.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Admin logout successful',
        ]);
    }
}
