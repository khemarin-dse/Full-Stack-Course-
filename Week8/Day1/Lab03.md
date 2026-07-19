# Lab 3: Routing, Views and Blade Template
## Student Management System

### 1. Project Initialization & Local Tailwind CSS Setup

#### Step A: Create a New Laravel Project
```bash
composer create-project --prefer-dist laravel/laravel
```

#### Step B: Install Tailwind CSS via NPM
Run the following commands in your terminal to install Tailwind CSS:
```base
npm install tailwindcss @tailwindcss/vite
```

#### Step C: Configure Template Paths
Open **vite.config.ts** file in the root directory and update the content array to scan your Blade views:
```javascript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // …
  ],
})
```
>full code in **vite.config.ts**
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
```
#### Step D: Add Tailwind Directives to CSS
Open resources/css/app.css and replace its contents with the following three lines:
```css
@import "tailwindcss";

@source "../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php";
@source "../../storage/framework/views/*.php";
@source "../**/*.blade.php";
@source "../**/*.js";
```
#### Step E: Compile Local Assets
Run the Vite development server to compile your styles in real-time:

```Bash
npm run dev
```


### 2. Defining Student Management Routes
Update your **routes/web.php** file to handle student management navigation:
```php
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
```

### 3. Checking Existing Routes
Run these commands in your terminal to review the registered routing structure:
``` base
php artisan route:list
php artisan route:list --except-vendor
php artisan route:list --only-vendor
php artisan route:list --path=students
php artisan route:list -h
```
>Note: php artisan route:list -h = Help documentation

### 4. Registering Routes for Multiple Verbs
Handle scenarios where a route accepts multiple or any HTTP Request method:
```php
# Registers the route to respond to both GET and POST methods
Route::match(['get','post'], '/hello', function(){
    return "<h1>Hello Portal</h1>";
});

# Registers the route to respond to any HTTP method
Route::any('/portal', function(){
    return "<h1>Welcome to the Student Hub!</h1>";
});
```
### 5. Route Parameters
Capture dynamic data (like student IDs or department names) straight from the URL:
```php
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
```
### 6. Constraining Route Parameters Format
Enforce specific data formats using built-in constraint methods:
```php
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
```

### 7. Named Routes
Assign descriptive names to your routes to make pathing easier within templates:

```php
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
```

### 8. Route Groups (Admin Prefix)
Group system administration dashboards under a shared routing prefix and naming convention:
```php
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
```
### 9. Configuring Student Views and Blade Templates
>Updated File: routes/web.php
```php
<?php

use Illuminate\Support\Facades\Route;

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
```
>Updated File: resources/views/welcome.blade.php
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management Portal</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-55 text-gray-800 font-sans min-h-screen flex flex-col justify-between">
    <div class="container mx-auto max-w-2xl mt-12 p-8 bg-white rounded-xl shadow-md border border-gray-100">
        <div class="border-b pb-6 text-center">
            <h1 class="text-3xl font-extrabold text-blue-900 tracking-tight">Royal University of Phnom Penh</h1>
            <div class="flex justify-center space-x-6 mt-4 text-lg font-semibold text-gray-600">
                <span>Class: <span class="text-blue-600">M1</span></span>
                <span>Student Name: <span class="text-blue-600">Dara</span></span>
            </div>
        </div>

        <div class="mt-8 text-center">
            <h2 class="text-2xl font-bold text-gray-700 mb-6">Student Management System</h2>
            <div>
                <a href="{{ route('students.index') }}" class="inline-block bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all">
                    Go to Student Directory &rarr;
                </a>
            </div>
        </div>
    </div>

    <footer class="text-center py-6 text-sm text-gray-400 font-medium">
        ITE &copy; 2026 Portal System
    </footer>
</body>
</html>
```

>Updated File: resources/views/students/index.blade.php
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Directory</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-55 text-gray-800 font-sans min-h-screen p-8">
    <div class="container mx-auto max-w-3xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between border-b pb-4 mb-6">
            <h1 class="text-2xl font-bold text-gray-900">All Registered Students</h1>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Active Semester</span>
        </div>

        <div class="flex flex-wrap gap-4 mb-8">
            <a href="{{ route('students.create') }}" class="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition">
                + Add New Student
            </a>
            <a href="{{ route('students.show', 1) }}" class="bg-gray-100 text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">
                View Sample Student Profile
            </a>
        </div>

        <div class="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700 rounded-r-lg">
            <p class="font-semibold">System Note</p>
            <p>This page represents the structured overview module of your dynamic directory layout.</p>
        </div>
    </div>
</body>
</html>
```
>Updated File: resources/views/students/create.blade.php
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Student</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-55 text-gray-800 font-sans min-h-screen p-8">
    <div class="container mx-auto max-w-xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">Register New Student</h1>
        
        <div class="space-y-4 mb-8">
            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Sok Dara" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Class Option</label>
                <input type="text" placeholder="e.g. M1" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200">
            </div>
        </div>

        <div class="border-t pt-4 flex items-center justify-between">
            <button class="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg opacity-70 cursor-not-allowed">Submit Record</button>
            <a href="{{ route('students.index') }}" class="text-sm font-medium text-gray-500 hover:text-blue-600 transition flex items-center">
                &larr; Back to Student Directory
            </a>
        </div>
    </div>
</body>
</html>
```
>Updated File: resources/views/students/show.blade.php
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Profile</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-55 text-gray-800 font-sans min-h-screen p-8">
    <div class="container mx-auto max-w-xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">Student Information</h1>
        
        <div class="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100">
            <p class="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Profile Identifier</p>
            <p class="text-xl font-bold text-blue-900">Dynamic Student ID: <span class="underline">{{ $id }}</span></p>
        </div>

        <div class="flex justify-between items-center border-t pt-4">
            <a href="{{ route('students.index') }}" class="text-sm font-medium text-blue-600 hover:underline">
                &larr; Return to Main Directory
            </a>
            <span class="text-xs text-gray-400 font-mono">Status: Rendered Valid</span>
        </div>
    </div>
</body>
</html>
```
### Submission Checklist
* Print each rendered browser page into a PDF file.
* Submit the PDF files via my personal account telegram or group.