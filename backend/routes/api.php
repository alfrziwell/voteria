<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminElectionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\MerkleController;
use App\Http\Controllers\VoterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/candidates', [CandidateController::class, 'index']);
Route::get('/candidates/{id}', [CandidateController::class, 'show']);
Route::get('/election/settings', [ElectionController::class, 'show']);
Route::post('/voters', [VoterController::class, 'store']);

// Protected Routes (Sanctum Authenticated)
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::get('/voter/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ZKP Merkle Path
    Route::get('/merkle/path/{hash}', [MerkleController::class, 'getMerklePath']);

    // Voting Status Callback
    Route::post('/voter/voted', [VoterController::class, 'updateVotedStatus']);

    // Vote Submission via Relayer
    Route::post('/election/submit-vote', [ElectionController::class, 'submitVote']);

    // CRUD and Admin Management Endpoints
    // Candidates CRUD
    Route::post('/candidates', [CandidateController::class, 'store']);
    Route::put('/candidates/{candidate}', [CandidateController::class, 'update']);
    Route::post('/candidates/{candidate}', [CandidateController::class, 'update']); // For multipart file uploads
    Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy']);

    // Voters CRUD & Bulk Import
    Route::get('/voters', [VoterController::class, 'index']);
    Route::get('/voters/{voter}', [VoterController::class, 'show']);
    Route::put('/voters/{voter}', [VoterController::class, 'update']);
    Route::delete('/voters/{voter}', [VoterController::class, 'destroy']);
    Route::post('/voters/import', [VoterController::class, 'import']);

    // Election settings update
    Route::put('/election/settings', [ElectionController::class, 'update']);
});

// Admin Routes Group
Route::prefix('admin')->group(function () {
    // Public Admin Route
    Route::post('/login', [AdminAuthController::class, 'login']);

    // Protected Admin Routes (Sanctum Authenticated for admins)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
        Route::post('/election/toggle', [AdminElectionController::class, 'toggleElectionStatus']);
    });
});
