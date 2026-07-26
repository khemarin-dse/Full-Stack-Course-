<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Budget;
use App\Models\Goal;
use App\Models\GoalHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);

        $user = $request->user();
        $user->update(['name' => $request->name, 'email' => $request->email]);

        return response()->json(['user' => $user, 'message' => 'Profile updated!']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => 'required',
            'password'              => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated!']);
    }

    public function clearData(Request $request)
    {
        $userId = $request->user()->id;
        Transaction::where('user_id', $userId)->delete();
        Budget::where('user_id', $userId)->delete();
        GoalHistory::where('user_id', $userId)->delete();
        Goal::where('user_id', $userId)->delete();

        return response()->json(['message' => 'All data cleared!']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        // Delete all related data
        Transaction::where('user_id', $userId)->delete();
        Budget::where('user_id', $userId)->delete();
        GoalHistory::where('user_id', $userId)->delete();
        Goal::where('user_id', $userId)->delete();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted.']);
    }
}
