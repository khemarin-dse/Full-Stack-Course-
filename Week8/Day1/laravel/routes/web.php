<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Hello ITE Student Management';
});

Route::get('/students', function(){
    return "<h1>All Students</h1>";
});

Route::get('/students/create', function (){
    return "<h1>Add New Student</h1>";
});

Route::get('/', function(){
    return view('welcome');
});

Route::get('/students', function () {
    return view('students.index');
})->name('students.index');

Route::get('/students/create', function () {
    return view('students.create');
})->name('students.create');

Route::get('/students/{id}', function ($id) {
    return view('students.show', ['id' => $id]);
})->name('students.show');
# Registers the route to respond to both GET and POST methods
Route::match(['get','post'], '/hello', function(){
    return "<h1>Hello Portal</h1>";
});

# Registers the route to respond to any HTTP method
Route::any('/portal', function(){
    return "<h1>Welcome to the Student Hub!</h1>";
});

// Required Parameter: Student ID
Route::get('/students/{id}', function ($id) {
    return "Student Record ID: " . $id;
});

// Optional Parameter: Department Name
Route::get('/departments/{name?}', function ($name = null) {
    if ($name) {
        return "Department: " . $name;
    } else {
        return "All Departments";
    }
});

// ID parameter must strictly be a number
Route::get('/constrain/student/{id}', function ($id) {
    return "Validated Student ID: " . $id;
})->whereNumber('id');

// Name parameter must strictly be alphanumeric
Route::get('/constrain/department/{name?}', function ($name = null) {
    if ($name) {
        return "Validated Department: " . $name;
    } else {
        return "All Validated Departments";
    }
})->whereAlphaNumeric('name');

Route::get('/home', function(){
    $html = "
    <link rel='stylesheet' href='/css/app.css'>
    <div class='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
        <div class='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
            <h1 class='text-2xl font-bold text-gray-800 mb-6'>Student Management System</h1>
            <div class='flex flex-col space-y-3'>
                <a href='" . route('students.index') . "' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-medium'>All Students</a>
                <a href='" . route('students.create') . "' class='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-medium'>Add Student</a>
                <a href='" . route('students.show', 1) . "' class='bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition font-medium'>Show Student Profile</a>
            </div>
        </div>
    </div>";
    return $html;
});

Route::get('/students', function(){
    return "<h1>All Students</h1>";
})->name('students.index');
    
Route::get('/students/create', function (){
    return "<h1>Add New Student</h1>";
})->name('students.create');

Route::get('/students/{id}', function ($id) {
    return "Student Profile ID: " . $id;
})->name('students.show');

Route::get('/group-dashboard', function(){
    $html = "
    <link rel='stylesheet' href='/css/app.css'>
    <div class='min-h-screen bg-gray-900 flex items-center justify-center p-6'>
        <div class='bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-700'>
            <h1 class='text-2xl font-bold text-white mb-6 tracking-wide'>Admin Student Portal</h1>
            <div class='flex flex-col space-y-3'>
                <a href='" . route('admin.students.index') . "' class='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition font-medium shadow'>Manage Students</a>
                <a href='" . route('admin.students.create') . "' class='bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition font-medium shadow'>Register Student</a>
                <a href='" . route('admin.students.show', 2) . "' class='bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition font-medium shadow'>View Student #2</a>
            </div>
        </div>
    </div>";
    return $html;
});

Route::prefix('admin')->name('admin.')->group(function(){
    Route::get('/students', function(){
        return "<h1 style='font-family:sans-serif; text-align:center; padding-top:40px;'>Admin Panel: All Students</h1>";
    })->name('students.index');

    Route::get('/students/create', function(){
       return "<h1 style='font-family:sans-serif; text-align:center; padding-top:40px;'>Admin Panel: Add New Student</h1>";
    })->name('students.create');

    Route::get('/student/{id}', function($id){
       return "<h1 style='font-family:sans-serif; text-align:center; padding-top:40px;'>Admin Panel: Student Profile ".$id."</h1>";
    })->whereNumber('id')->name('students.show');
});