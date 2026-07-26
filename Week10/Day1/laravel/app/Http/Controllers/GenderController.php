<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all gender records along with their matching student count
        $genders = Gender::withCount('students')->get();

        // Render your view dashboard workspace element
        return view('pages.genders.index', compact('genders'));
    }

    // You can implement create, store, edit, update, and destroy logic below as needed...
}