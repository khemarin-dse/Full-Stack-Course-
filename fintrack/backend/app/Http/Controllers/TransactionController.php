<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Goal;
use App\Models\GoalHistory;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('user_id', $request->user()->id)
            ->orderByDesc('date')
            ->orderByDesc('created_at');

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->month) {
            $query->whereYear('date', substr($request->month, 0, 4))
                  ->whereMonth('date', substr($request->month, 5, 2));
        }

        $limit = $request->limit ?? null;
        $transactions = $limit ? $query->limit($limit)->get() : $query->get();

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'        => 'required|in:income,expense',
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0.01',
            'category'    => 'required|string|max:100',
            'date'        => 'required|date',
            'goal_id'     => 'nullable|exists:goals,id',
            'note'        => 'nullable|string|max:500',
        ]);

        $userId = $request->user()->id;

        // A transaction linked to a goal represents money being moved into
        // that goal, not new income — even if the "Income / Savings" tab
        // was used to create it. Record it as an expense so it comes out of
        // the dashboard's available savings instead of inflating income.
        $type = ($request->type === 'income' && $request->goal_id) ? 'expense' : $request->type;

        $transaction = Transaction::create([
            'user_id'     => $userId,
            'type'        => $type,
            'description' => $request->description,
            'amount'      => $request->amount,
            'category'    => $request->category,
            'goal_id'     => $request->goal_id,
            'date'        => $request->date,
            'note'        => $request->note,
        ]);

        // If linked to a goal, add to goal saved amount and record history
        if ($request->goal_id) {
            $goal = Goal::where('id', $request->goal_id)
                        ->where('user_id', $userId)
                        ->first();

            if ($goal) {
                $goal->increment('saved_amount', $request->amount);

                GoalHistory::create([
                    'user_id'     => $userId,
                    'goal_id'     => $goal->id,
                    'amount'      => $request->amount,
                    'description' => $request->description,
                    'source'      => 'transaction',
                    'date'        => $request->date,
                ]);
            }
        }

        return response()->json($transaction, 201);
    }

    public function show(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);
        return response()->json($transaction);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'type'        => 'sometimes|in:income,expense',
            'description' => 'sometimes|string|max:255',
            'amount'      => 'sometimes|numeric|min:0.01',
            'category'    => 'sometimes|string|max:100',
            'date'        => 'sometimes|date',
            'note'        => 'nullable|string|max:500',
        ]);

        $transaction->update($request->only(['type', 'description', 'amount', 'category', 'date', 'note']));
        return response()->json($transaction);
    }

    public function destroy(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)->findOrFail($id);
        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted']);
    }
}
