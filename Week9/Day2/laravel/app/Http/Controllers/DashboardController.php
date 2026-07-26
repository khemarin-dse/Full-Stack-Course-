<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use App\Models\Student;

class DashboardController extends Controller
{
    public function index()
    {
        // Query numeric analysis indices via Eloquent ORM layers
        $totalStudents = Student::count();
        $maleStudents = Student::whereHas('gender', function($q) { $q->where('name', 'Male'); })->count();
        $femaleStudents = Student::whereHas('gender', function($q) { $q->where('name', 'Female'); })->count();
        
        // Count total gender categories available in the database
        $totalGenders = Gender::count(); 

        // Extract a collection of the latest registered candidates
        $recentStudents = Student::with('gender')->latest()->take(5)->get();

        return view('pages.dashboard.index', compact(
            'totalStudents',
            'maleStudents',
            'femaleStudents',
            'totalGenders',
            'recentStudents'
        ));
    }
}