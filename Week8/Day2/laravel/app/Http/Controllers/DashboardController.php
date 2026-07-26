<?php

namespace App\Http\Controllers;

use App\Services\Data;

class DashboardController extends Controller
{
    public function index()
    {
        $students = collect(Data::students());

        $totalStudents =$students->count();
        $maleStudents =$students->where('gender', 'Male')->count();
        $femaleStudents =$students->where('gender', 'Female')->count();
        $activeStudents =$students->where('status', 'Active')->count();

        $recentStudents =$students->take(5);

        return view('pages.dashboard.index', compact(
            'totalStudents',
            'maleStudents',
            'femaleStudents',
            'activeStudents',
            'recentStudents'
        ));
    }
}