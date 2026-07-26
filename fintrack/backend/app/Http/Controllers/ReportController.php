<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;
        $period = $request->period ?? '6months';

        // Determine date range
        switch ($period) {
            case 'year':
                $start = now()->startOfYear();
                $end   = now()->endOfYear();
                $label = 'Jan – Dec ' . now()->year;
                $months = 12;
                break;
            case 'lastyear':
                $start = now()->subYear()->startOfYear();
                $end   = now()->subYear()->endOfYear();
                $label = 'Jan – Dec ' . now()->subYear()->year;
                $months = 12;
                break;
            default: // 6months
                $start = now()->subMonths(5)->startOfMonth();
                $end   = now()->endOfMonth();
                $label = $start->format('M') . ' – ' . now()->format('M Y');
                $months = 6;
        }

        // Build monthly breakdown
        $monthly = collect();
        $startClone = $start->copy();
        for ($i = 0; $i < $months; $i++) {
            $date = $startClone->copy()->addMonths($i);
            $income = Transaction::where('user_id', $userId)
                ->where('type', 'income')
                ->whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->sum('amount');

            $expense = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->sum('amount');

            $monthly->push([
                'month'       => $date->format('M'),
                'month_label' => $date->format('F'),
                'income'      => (float) $income,
                'expense'     => (float) $expense,
                'savings'     => (float) ($income - $expense),
            ]);
        }

        $totIncome  = $monthly->sum('income');
        $totExpense = $monthly->sum('expense');
        $totSavings = $totIncome - $totExpense;
        $avgMonthly = $months > 0 ? round($totExpense / $months) : 0;
        $savingsRate = $totIncome > 0 ? round(($totSavings / $totIncome) * 100) : 0;

        return response()->json([
            'period_label' => $label,
            'monthly'      => $monthly,
            'totals'       => [
                'income'      => $totIncome,
                'expense'     => $totExpense,
                'savings'     => $totSavings,
                'avg_monthly' => $avgMonthly,
                'savings_rate'=> $savingsRate,
            ],
        ]);
    }
}
