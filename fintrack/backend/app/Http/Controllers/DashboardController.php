<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;
        $month  = now()->format('Y-m');
        $year   = now()->year;
        $mon    = now()->month;

        $income = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereYear('date', $year)
            ->whereMonth('date', $mon)
            ->sum('amount');

        $expense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereYear('date', $year)
            ->whereMonth('date', $mon)
            ->sum('amount');

        $savings      = $income - $expense;
        $savingsRate  = $income > 0 ? round(($savings / $income) * 100) : 0;

        // Budget used this month
        $budgets = Budget::where('user_id', $userId)->where('month', $month)->get();
        $totalLimit   = $budgets->sum('limit_amount');
        $totalSpent   = $budgets->sum('spent_amount');
        $budgetPct    = $totalLimit > 0 ? round(($totalSpent / $totalLimit) * 100) : 0;
        $budgetRemain = max($totalLimit - $totalSpent, 0);

        return response()->json([
            'income'            => $income,
            'expense'           => $expense,
            'savings'           => $savings,
            'savings_rate'      => $savingsRate,
            'budget_used_pct'   => $budgetPct,
            'budget_remaining'  => $budgetRemain,
        ]);
    }

    public function chart(Request $request)
    {
        $userId = $request->user()->id;

        // Jan–Dec of the current year
        $year = now()->year;
        $months = collect();
        for ($m = 1; $m <= 12; $m++) {
            $date = now()->startOfYear()->addMonths($m - 1);
            $months->push([
                'month'    => $date->format('M'),
                'year'     => $year,
                'mon'      => $m,
                'monthKey' => $date->format('Y-m'),
            ]);
        }

        $monthly = $months->map(function ($m) use ($userId) {
            $income = Transaction::where('user_id', $userId)
                ->where('type', 'income')
                ->whereYear('date', $m['year'])
                ->whereMonth('date', $m['mon'])
                ->sum('amount');

            $expense = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereYear('date', $m['year'])
                ->whereMonth('date', $m['mon'])
                ->sum('amount');

            $savings     = $income - $expense;
            $savingsRate = $income > 0 ? round(($savings / $income) * 100) : 0;

            $budgets      = Budget::where('user_id', $userId)->where('month', $m['monthKey'])->get();
            $totalLimit   = $budgets->sum('limit_amount');
            $totalSpent   = $budgets->sum('spent_amount');
            $budgetPct    = $totalLimit > 0 ? round(($totalSpent / $totalLimit) * 100) : 0;
            $budgetRemain = max($totalLimit - $totalSpent, 0);

            // Expense-by-category breakdown for this specific month, so the
            // "Spending by category" chart can show whichever month is selected.
            $categories = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereYear('date', $m['year'])
                ->whereMonth('date', $m['mon'])
                ->select('category', DB::raw('SUM(amount) as value'))
                ->groupBy('category')
                ->orderByDesc('value')
                ->limit(5)
                ->get()
                ->map(fn($r) => ['name' => $r->category, 'value' => (float) $r->value]);

            return [
                'month'            => $m['month'],
                'year'             => $m['year'],
                'monthKey'         => $m['monthKey'],
                'income'           => (float) $income,
                'expense'          => (float) $expense,
                'savings'          => (float) $savings,
                'savings_rate'     => $savingsRate,
                'budget_used_pct'  => $budgetPct,
                'budget_remaining' => (float) $budgetRemain,
                'budgets'          => $budgets->map(fn($b) => [
                    'id'            => $b->id,
                    'category'      => $b->category,
                    'limit_amount'  => (float) $b->limit_amount,
                    'spent_amount'  => (float) $b->spent_amount,
                ]),
                'categories'       => $categories,
            ];
        });

        return response()->json([
            'monthly' => $monthly,
        ]);
    }
}
