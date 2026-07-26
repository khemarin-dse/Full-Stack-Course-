<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\JsonResponse;

class GenderController extends Controller
{
    public function index(): JsonResponse
    {
        $genders = Gender::withCount('students')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Gender list retrieved successfully.',
            'data' => $genders,
        ]);
    }

    public function show(Gender $gender): JsonResponse
    {
        $gender->load('students');

        return response()->json([
            'message' => 'Gender retrieved successfully.',
            'data' => $gender,
        ]);
    }
}