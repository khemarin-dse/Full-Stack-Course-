<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use App\Models\Budget;
use App\Models\Goal;
use App\Models\GoalHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo user
        $user = User::create([
            'name'     => 'Khem Heng',
            'email'    => 'khem@email.com',
            'password' => Hash::make('password123'),
        ]);

        $uid  = $user->id;
        $now  = now();
        $year = $now->year;
        $mon  = $now->month;

        // --- TRANSACTIONS ---
        $transactions = [
            ['income',  'Monthly salary',     4200, 'Salary',        null, "$year-$mon-05"],
            ['expense', 'Rent payment',       1050, 'Housing',       null, "$year-$mon-01"],
            ['expense', 'Grocery shopping',     85, 'Food',          null, "$year-$mon-03"],
            ['expense', 'Grab transport',        12, 'Transport',    null, "$year-$mon-05"],
            ['expense', 'Phone bill',            25, 'Utilities',    null, "$year-$mon-04"],
            ['expense', 'Coffee & snacks',       18, 'Food',         null, "$year-$mon-04"],
            ['expense', 'Netflix subscription',  15, 'Entertainment',null, "$year-$mon-02"],
            ['expense', 'Gym membership',        30, 'Healthcare',   null, "$year-$mon-02"],
        ];

        $prev = $now->copy()->subMonth();
        $py   = $prev->year;
        $pm   = $prev->month;

        $prevTransactions = [
            ['income',  'Monthly salary',  4100, 'Salary',   null, "$py-$pm-05"],
            ['expense', 'Rent payment',    1050, 'Housing',  null, "$py-$pm-01"],
            ['expense', 'Grocery',          120, 'Food',     null, "$py-$pm-10"],
            ['expense', 'Transport',         45, 'Transport',null, "$py-$pm-15"],
        ];

        foreach (array_merge($transactions, $prevTransactions) as $t) {
            Transaction::create([
                'user_id'     => $uid,
                'type'        => $t[0],
                'description' => $t[1],
                'amount'      => $t[2],
                'category'    => $t[3],
                'goal_id'     => $t[4],
                'date'        => $t[5],
            ]);
        }

        // --- BUDGETS ---
        $budgets = [
            ['Housing',       1200],
            ['Food',           800],
            ['Transport',      500],
            ['Entertainment',  400],
        ];

        foreach ($budgets as $b) {
            Budget::create([
                'user_id'      => $uid,
                'category'     => $b[0],
                'limit_amount' => $b[1],
                'month'        => $now->format('Y-m'),
            ]);
        }

        // --- GOALS ---
        $vacationGoal = Goal::create([
            'user_id'       => $uid,
            'name'          => 'Vacation fund',
            'type'          => 'Vacation',
            'target_amount' => 3000,
            'saved_amount'  => 1400,
            'deadline'      => $now->copy()->addMonths(6)->format('Y-m-d'),
            'note'          => 'Family trip to Japan 🗾',
        ]);

        $laptopGoal = Goal::create([
            'user_id'       => $uid,
            'name'          => 'New laptop',
            'type'          => 'Electronics',
            'target_amount' => 1500,
            'saved_amount'  => 600,
            'deadline'      => $now->copy()->addMonths(3)->format('Y-m-d'),
            'note'          => 'MacBook Pro for school',
        ]);

        Goal::create([
            'user_id'       => $uid,
            'name'          => 'Emergency fund',
            'type'          => 'Emergency fund',
            'target_amount' => 5000,
            'saved_amount'  => 2500,
            'deadline'      => $now->copy()->addMonths(6)->format('Y-m-d'),
            'note'          => '6 months of expenses',
        ]);

        Goal::create([
            'user_id'       => $uid,
            'name'          => 'Car down payment',
            'type'          => 'Vehicle',
            'target_amount' => 4000,
            'saved_amount'  => 800,
            'deadline'      => $now->copy()->addMonths(12)->format('Y-m-d'),
            'note'          => '',
        ]);

        // --- GOAL HISTORIES ---
        $histories = [
            [$vacationGoal->id, 'Weekly savings deposit', 200, 'transaction', "$year-$mon-06"],
            [$vacationGoal->id, 'Monthly savings',        200, 'transaction', "$py-$pm-30"],
            [$vacationGoal->id, 'Manual update',          500, 'manual',      "$py-$pm-01"],
            [$vacationGoal->id, 'Bonus income',           300, 'transaction', $now->copy()->subMonths(2)->format('Y-m-15')],
            [$vacationGoal->id, 'First deposit',          200, 'transaction', $now->copy()->subMonths(3)->format('Y-m-01')],
            [$laptopGoal->id,   'Monthly savings',        200, 'transaction', "$year-$mon-06"],
            [$laptopGoal->id,   'Monthly savings',        200, 'transaction', "$py-$pm-05"],
            [$laptopGoal->id,   'Initial savings',        200, 'manual',      $now->copy()->subMonths(2)->format('Y-m-01')],
        ];

        foreach ($histories as $h) {
            GoalHistory::create([
                'user_id'     => $uid,
                'goal_id'     => $h[0],
                'description' => $h[1],
                'amount'      => $h[2],
                'source'      => $h[3],
                'date'        => $h[4],
            ]);
        }
    }
}
