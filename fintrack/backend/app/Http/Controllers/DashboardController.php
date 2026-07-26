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

        // Last 6 months bar chart data
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months->push([
                'month'   => $date->format('M'),
                'year'    => $date->year,
                'mon'     => $date->month,
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

            return [
                'month'   => $m['month'],
                'income'  => (float) $income,
                'expense' => (float) $expense,
            ];
        });

        // Pie chart - expense by category this month
        $pie = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereYear('date', now()->year)
            ->whereMonth('date', now()->month)
            ->select('category', DB::raw('SUM(amount) as value'))
            ->groupBy('category')
            ->orderByDesc('value')
            ->limit(5)
            ->get()
            ->map(fn($r) => ['name' => $r->category, 'value' => (float) $r->value]);

        return response()->json([
            'monthly' => $monthly,
            'pie'     => $pie,
        ]);
    }
}
