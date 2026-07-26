<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

// Unprotected API entries for initial session establishment vectors
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Cryptographically isolated API middleware gate boundary zone
Route::middleware('auth:sanctum')->group(function () {
    
    // Identity verification endpoints
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Automated API resource routing arrays
    Route::apiResource('students', StudentController::class);

    // Explicit read-only gender dictionary matrices paths
    Route::get('/genders', [GenderController::class, 'index']);
    Route::get('/genders/{gender}', [GenderController::class, 'show']);
});