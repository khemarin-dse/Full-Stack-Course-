<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->month ?? now()->format('Y-m');

        $budgets = Budget::where('user_id', $request->user()->id)
            ->where('month', $month)
            ->get();

        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category'     => 'required|string|max:100',
            'limit_amount' => 'required|numeric|min:1',
            'month'        => 'required|date_format:Y-m',
        ]);

        $userId = $request->user()->id;

        // Prevent duplicate budget for same category & month
        $existing = Budget::where('user_id', $userId)
            ->where('category', $request->category)
            ->where('month', $request->month)
            ->first();

        if ($existing) {
            $existing->update(['limit_amount' => $request->limit_amount]);
            return response()->json($existing);
        }

        $budget = Budget::create([
            'user_id'      => $userId,
            'category'     => $request->category,
            'limit_amount' => $request->limit_amount,
            'month'        => $request->month,
        ]);

        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'limit_amount' => 'sometimes|numeric|min:1',
            'category'     => 'sometimes|string|max:100',
            'month'        => 'sometimes|date_format:Y-m',
        ]);

        $budget->update($request->only(['category', 'limit_amount', 'month']));
        return response()->json($budget);
    }

    public function destroy(Request $request, $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)->findOrFail($id);
        $budget->delete();
        return response()->json(['message' => 'Budget deleted']);
    }
}
