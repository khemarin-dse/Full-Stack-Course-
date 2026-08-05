<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\GoalHistory;
use App\Models\Transaction;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = Goal::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($goals);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'type'          => 'required|string|max:100',
            'target_amount' => 'required|numeric|min:1',
            'saved_amount'  => 'nullable|numeric|min:0',
            'deadline'      => 'nullable|date',
            'note'          => 'nullable|string|max:500',
        ]);

        $goal = Goal::create([
            'user_id'       => $request->user()->id,
            'name'          => $request->name,
            'type'          => $request->type,
            'target_amount' => $request->target_amount,
            'saved_amount'  => $request->saved_amount ?? 0,
            'deadline'      => $request->deadline,
            'note'          => $request->note,
        ]);

        // If user already had some saved amount, record it in history
        if ($request->saved_amount && $request->saved_amount > 0) {
            GoalHistory::create([
                'user_id'     => $request->user()->id,
                'goal_id'     => $goal->id,
                'amount'      => $request->saved_amount,
                'description' => 'Initial savings',
                'source'      => 'manual',
                'date'        => now()->toDateString(),
            ]);
        }

        return response()->json($goal, 201);
    }

    public function show(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)
            ->with(['histories'])
            ->findOrFail($id);

        $history = $goal->histories->map(function ($h) {
            return [
                'amount'      => $h->amount,
                'description' => $h->description,
                'source'      => $h->source,
                'date'        => $h->date,
            ];
        });

        return response()->json([
            'goal'    => $goal,
            'history' => $history,
        ]);
    }

    public function update(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'name'          => 'sometimes|string|max:255',
            'type'          => 'sometimes|string|max:100',
            'target_amount' => 'sometimes|numeric|min:1',
            'saved_amount'  => 'sometimes|numeric|min:0',
            'deadline'      => 'nullable|date',
            'note'          => 'nullable|string|max:500',
        ]);

        $goal->update($request->only(['name', 'type', 'target_amount', 'saved_amount', 'deadline', 'note']));
        return response()->json($goal);
    }

    public function destroy(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)->findOrFail($id);
        // Delete related history
        GoalHistory::where('goal_id', $goal->id)->delete();
        $goal->delete();
        return response()->json(['message' => 'Goal deleted']);
    }

    public function addMoney(Request $request, $id)
    {
        $goal = Goal::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date'   => 'required|date',
            'note'   => 'nullable|string|max:500',
        ]);

        // Add to goal saved amount
        $goal->increment('saved_amount', $request->amount);

        // Record in history
        GoalHistory::create([
            'user_id'     => $request->user()->id,
            'goal_id'     => $goal->id,
            'amount'      => $request->amount,
            'description' => $request->note ?? 'Savings deposit',
            'source'      => 'manual',
            'date'        => $request->date,
        ]);

        // This money is being moved out of the user's existing savings
        // (it was already counted as income earlier), not new income.
        // Record it as an expense-type transaction so it lowers the
        // dashboard's "savings" (income - expense) without touching income.
        Transaction::create([
            'user_id'     => $request->user()->id,
            'type'        => 'expense',
            'description' => $request->note ?? "Added to goal: {$goal->name}",
            'amount'      => $request->amount,
            'category'    => 'Savings',
            'goal_id'     => $goal->id,
            'date'        => $request->date,
            'note'        => $request->note,
        ]);

        $goal->refresh();

        return response()->json([
            'goal'    => $goal,
            'message' => 'Money added to goal!',
        ]);
    }
}
