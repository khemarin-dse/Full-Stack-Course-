<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Publicly reachable system root landing vector
Route::get('/', function () {
    return view('welcome');
});

// Structural security gate group middleware mapping zone
Route::middleware(['auth'])->group(function () {
    
    // Core workspace dashboard engine analytics link
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Complete CRUD matrix resource endpoint trees
    Route::resource('students', StudentController::class);
    Route::resource('genders', GenderController::class);

    // Profile administrative maintenance operations actions
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Inject auth orchestration routes mapping blueprint 
require __DIR__.'/auth.php';