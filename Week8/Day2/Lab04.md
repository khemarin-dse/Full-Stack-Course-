# Lab 4: Resource Controllers, Data Mocking Services, and Advanced Blade Layouts
## Student Management System (Continuation)

### Submission Checklist
* Print each rendered browser page into a PDF file.
* Submit the PDF files via my personal account telegram or group.

---

### 1. Repository Reinitialization & Local Asset Strategy

#### Step A: Establish Local Environment Environment Files
If cloning from a template repository, duplicate your configuration structure:
```bash
cp .env.example .env
php artisan key:generate
```

#### Step B: Local Styles Optimization (resources/css/app.css)
Ensure your compiled production theme maps precisely onto your Blade directory trees while applying the designated color tokens:
```css
@import "tailwindcss";

@source "../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php";
@source "../../storage/framework/views/*.php";
@source "../**/*.blade.php";
@source "../**/*.js";

@theme {
    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';

    --color-primary: #00335b;
    --color-secondary: #00a8e8;
}
```

#### Step C: Run Compilation Server
>Execute the asset server to watch and bundle view changes in real time:
```base
npm run dev
```

### 2. Infrastructure Mock Data Layer
Provider Class: `app/Services/Data.php`

Create the custom utility data collection to distribute application models consistently across views:
```php
<?php

namespace App\Services;

class Data
{
    public static array $students = [
        [
            'id' => 1,
            'name' => 'Sok Dara',
            'gender' => 'Male',
            'email' => 'sok.dara@rupp.edu.kh',
            'phone' => '010 123 123',
            'class' => 'Laravel A',
            'status' => 'Active',
        ],
        [
            'id' => 2,
            'name' => 'Sok Pisey',
            'gender' => 'Female',
            'email' => 'sok.pisey@rupp.edu.kh',
            'phone' => '011 123 123',
            'class' => 'Laravel A',
            'status' => 'Active',
        ],
        [
            'id' => 3,
            'name' => 'Sros Bopha',
            'gender' => 'Female',
            'email' => 'sros.bopha@rupp.edu.kh',
            'phone' => '090 909 123',
            'class' => 'Laravel B',
            'status' => 'Pending',
        ],
        [
            'id' => 4,
            'name' => 'Tith Sovan',
            'gender' => 'Male',
            'email' => 'tith.sovan@rupp.edu.kh',
            'phone' => '090 902 283',
            'class' => 'Laravel B',
            'status' => 'Inactive',
        ],
        [
            'id' => 5,
            'name' => 'Chan Leakhena',
            'gender' => 'Female',
            'email' => 'chan.leakhena@rupp.edu.kh',
            'phone' => '090 233 322',
            'class' => 'Laravel C',
            'status' => 'Active',
        ],
    ];

    public static array $genders = [
        ['id' => 1, 'name' => 'Male'],
        ['id' => 2, 'name' => 'Female'],
    ];

    public static function students(): array
    {
        return self::$students;
    }

    public static function genders(): array
    {
        return self::$genders;
    }

    public static function findStudent(int $id): ?array
    {
        return collect(self::$students)->firstWhere('id',$id);
    }
}
```
### 3. Application Controllers & Routing Matrix
#### Step A: Generate Target Handlers
```base
php artisan make:controller DashboardController
php artisan make:controller StudentController --resource
```
#### Step B: Core Routing Blueprint `(routes/web.php)`
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return view('pages.home');
})->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

Route::resource('students', StudentController::class)
    ->only(['index', 'create', 'show']);
```
#### Step C: Controller Engine `(app/Http/Controllers/DashboardController.php)`
```php
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
```
#### Step D: Resource Engine `(app/Http/Controllers/StudentController.php)`
```php
<?php

namespace App\Http\Controllers;

use App\Services\Data;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = collect(Data::students());$genders = Data::genders();

        if ($request->filled('search')) {
            $search = strtolower($request->search);

            $students =$students->filter(function ($student) use ($search) {
                return str_contains(strtolower($student['name']),$search)
                    || str_contains(strtolower($student['email']),$search)
                    || str_contains(strtolower($student['class']),$search);
            });
        }

        if ($request->filled('gender')) {$students = $students->where('gender',$request->gender);
        }

        return view('pages.students.index', [
            'students' => $students->values(),
            'genders' => $genders,
            'search' => $request->search,
            'selectedGender' => $request->gender,
        ]);
    }

    public function create()
    {
        $genders = Data::genders();
        return view('pages.students.create', compact('genders'));
    }

    public function show(string $id)
    {
        $student = Data::findStudent((int)$id);

        abort_unless($student, 404, 'Student record could not be found within the registry database.');

        return view('pages.students.show', compact('student'));
    }
}
```
## 4. Layout Framework Templates
### Public Landing Base File: `resources/views/layouts/guest.blade.php`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800">
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="{{ route('home') }}" class="text-2xl font-bold text-primary tracking-tight">
                SMS Lab Portal
            </a>
            <div class="flex items-center gap-4">
                <a href="{{ route('dashboard') }}" class="text-gray-700 hover:text-primary font-medium transition">
                    Dashboard
                </a>
                <a href="{{ route('students.index') }}" class="bg-primary text-white px-5 py-2 rounded-full hover:bg-secondary font-semibold shadow-sm transition">
                    Students Registry
                </a>
            </div>
        </div>
    </header>
    <main>
        @yield('content')
    </main>
</body>
</html>
```
### Workspace Panel Base File: `resources/views/layouts/app.blade.php`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800">
<div class="flex min-h-screen">
    <aside class="w-64 bg-white border-r border-gray-200">
        <div class="p-6 border-b border-gray-200">
            <h1 class="text-xl font-bold text-primary tracking-tight">
                SMS Workspace
            </h1>
        </div>
        <nav class="p-4 space-y-2">
            <a href="{{ route('dashboard') }}"
               class="block px-4 py-3 rounded-xl font-medium transition
               {{ request()->routeIs('dashboard') ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-primary' }}">
                Dashboard
            </a>
            <a href="{{ route('students.index') }}"
               class="block px-4 py-3 rounded-xl font-medium transition
               {{ request()->routeIs('students.*') ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-primary' }}">
                Students Directory
            </a>
        </nav>
    </aside>

    <div class="flex-1 flex flex-col">
        <header class="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-xs">
            <div>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                    @yield('parent')
                </p>
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
                    @yield('page')
                </h2>
            </div>
            <div class="text-sm font-medium text-gray-500 bg-gray-50 border px-4 py-1.5 rounded-lg">
                Classman: <span class="text-primary font-bold">Dara M1</span>
            </div>
        </header>
        <main class="p-8 flex-grow">
            @yield('content')
        </main>
    </div>
</div>
</body>
</html>
```
## 5. Specialized Element Component Library
### Reusable UI Element Button Framework:
>resources/views/components/button.blade.php
```php
@props([
    'href' => null,
    'type' => 'button',
    'variant' => 'primary',
])

@php
    $variants = [
        'primary' => 'bg-primary hover:bg-secondary text-white shadow-xs',
        'secondary' => 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-xs',
        'danger' => 'bg-red-600 hover:bg-red-700 text-white shadow-xs',
    ];

    $classes = 'inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm transition transform active:scale-95 duration-100 ' . $variants[$variant];
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' =>$classes]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' =>$classes]) }}>
        {{ $slot }}
    </button>
@endif
```

## 6. Interactive Main Application Templates
### Landing Interface Page: 
>`resources/views/pages/home.blade.php`
```html
@extends('layouts.guest')
@section('title', 'Student Management System')
@section('content')
<div class="min-h-[80vh] flex items-center justify-center px-6 bg-linear-to-b from-blue-50/50 to-transparent">
    <div class="max-w-3xl text-center">
        <span class="bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Royal University of Phnom Penh</span>
        <h1 class="text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6">
            Core Student Registry <br><span class="text-primary">Management Workspace</span>
        </h1>
        <p class="text-gray-500 mt-6 text-lg max-w-xl mx-auto leading-relaxed">
            Practice structural Laravel route architectures, parameters validation filters, template controllers, component contexts, and customized template partial compilation loops.
        </p>
        <div class="mt-8 flex justify-center gap-4">
            <x-button :href="route('dashboard')" variant="primary">Launch Workspace</x-button>
            <x-button :href="route('students.index')" variant="secondary">Browse Student Records</x-button>
        </div>
    </div>
</div>
@endsection
```
### Core System Analytic Panel Layout:
>resources/views/pages/dashboard/index.blade.php
```html
@extends('layouts.app')
@section('title', 'System Dashboard Overview')
@section('parent', 'Dashboard')
@section('page', 'Overview Dashboard')
@section('content')
<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Total Enrollment</p>
            <h3 class="text-3xl font-black text-gray-900 mt-2 tracking-tight">{{ $totalStudents }}</h3>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Male Segment</p>
            <h3 class="text-3xl font-black text-primary mt-2 tracking-tight">{{ $maleStudents }}</h3>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Female Segment</p>
            <h3 class="text-3xl font-black text-pink-600 mt-2 tracking-tight">{{ $femaleStudents }}</h3>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Active Enrollment Status</p>
            <h3 class="text-3xl font-black text-green-600 mt-2 tracking-tight">{{ $activeStudents }}</h3>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 class="text-lg font-bold text-gray-900 tracking-tight">Recent Registered Profiles</h2>
                <p class="text-xs text-gray-400 mt-0.5">Dynamic collection models requested straight from core service app/Services/Data.php</p>
            </div>
            <x-button :href="route('students.index')" variant="secondary">Manage All</x-button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">Index</th>
                        <th class="px-6 py-4">Full Name</th>
                        <th class="px-6 py-4">Email</th>
                        <th class="px-6 py-4">Gender Group</th>
                        <th class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-medium text-sm text-gray-700">
                    @foreach ($recentStudents as$student)
                        <tr class="hover:bg-gray-50/50 transition">
                            <td class="px-6 py-3.5 text-gray-400">{{ $loop->iteration }}</td>
                            <td class="px-6 py-3.5 font-bold text-gray-900">{{ $student['name'] }}</td>
                            <td class="px-6 py-3.5 font-mono text-xs text-gray-500">{{ $student['email'] }}</td>
                            <td class="px-6 py-3.5 text-gray-600">{{ $student['gender'] }}</td>
                            <td class="px-6 py-3.5">
                                @include('pages.students.partials.status', ['status' => $student['status']])
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
```
### Dynamic Database Registry Table Layout:
>resources/views/pages/students/index.blade.php
```html
@extends('layouts.app')
@section('title', 'Student Registry Records Engine')
@section('parent', 'Students Registry')
@section('page', 'Master Data Directory')
@section('content')
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Active Directory Sheets</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">Evaluate structural routing parameters, request filtering validations and custom inclusion loops.</p>
        </div>
        <x-button :href="route('students.create')" variant="primary">Add Student UI</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Search Query String</label>
                <input type="text" name="search" value="{{ $search }}" placeholder="Search by name, email, or course cohort..." class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Category Filter</label>
                <select name="gender" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="">All Genders Available</option>
                    @foreach ($genders as$gender)
                        <option value="{{ $gender['name'] }}" @selected($selectedGender === $gender['name'])>{{$gender['name'] }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-grow bg-primary hover:bg-secondary text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer">Execute Filter</button>
                <a href="{{ route('students.index') }}" class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm px-5 py-2.5 rounded-xl transition text-center flex items-center justify-center">Clear Filters</a>
            </div>
        </form>
        @if ($search \vert{}\vert{}$selectedGender)
            <div class="mt-4 flex items-center text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg w-max">
                ⚠️ Workspace parameters are currently applied.
            </div>
        @endif
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">Index</th>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Mailing Location</th>
                        <th class="px-6 py-4">Gender</th>
                        <th class="px-6 py-4">Assigned Course</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4 text-center">Action Parameters</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    @forelse ($students as$student)
                        @include('pages.students.partials.row', ['student' => $student])
                    @empty
                        @include('pages.students.partials.empty')
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
```
### Detailed Profile Layout:
>resources/views/pages/students/show.blade.php
```html
@extends('layouts.app')
@section('title', 'Student Profile Dossier')
@section('parent', 'Registry Dossier')
@section('page', 'Detailed Record Dossier')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
                {{ $student['name'] }}
            </h1>
            <p class="text-xs font-bold text-primary px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md inline-block mt-1">
                UID String: #00{{ $student['id'] }}
            </p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Back to Registry</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Legal Surname & Name</p>
            <p class="font-bold text-gray-900 text-lg mt-1">{{ $student['name'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Communication Endpoint</p>
            <p class="font-mono text-sm text-primary font-bold mt-1">{{ $student['email'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Mobile Telecom Connection</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student['phone'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Gender Orientation Identity</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student['gender'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Class Cohort Group Allocation</p>
            <p class="font-bold text-primary mt-1">{{ $student['class'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">System Operational State</p>
            <div class="mt-2">
                @include('pages.students.partials.status', ['status' => $student['status']])
            </div>
        </div>
    </div>
</div>
@endsection
```
### Dummy Entry Insertion Workspace Layout:
>resources/views/pages/students/create.blade.php
```html
@extends('layouts.app')
@section('title', 'Register New Candidate Workspace')
@section('parent', 'Students Entry')
@section('page', 'Create Record Instance UI')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Add New Registration</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">This view template operates exclusively for custom parameter structuring layout validation tests.</p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Discard Changes</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="space-y-6">
            @include('pages.students.partials.form')
            
            <div class="border-t border-gray-100 pt-6 flex justify-end gap-3">
                <x-button :href="route('students.index')" variant="secondary">Cancel Space</x-button>
                <button type="submit" class="bg-primary hover:bg-secondary text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer">Save UI Context Sample</button>
            </div>
        </form>
    </div>
</div>
@endsection
```
## 7. Layout Partial Splitting Substructures
### State Label Status Indicators Matrix Component:
>resources/views/pages/students/partials/status.blade.php
```html
@switch($status)
    @case('Active')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700">Active</span>
        @break
    @case('Pending')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-600">Pending</span>
        @break
    @case('Inactive')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-600">Inactive</span>
        @break
    @default
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600">Unknown</span>
@endswitch
```
### Registry Line Row Context Component Fragment:
>resources/views/pages/students/partials/row.blade.php
```html
<tr class="hover:bg-gray-50/50 border-t border-gray-100 transition">
    <td class="px-6 py-4 text-xs text-gray-400">{{ $loop->iteration }}</td>
    <td class="px-6 py-4 font-bold text-gray-900">{{ $student['name'] }}</td>
    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ $student['email'] }}</td>
    <td class="px-6 py-4 text-gray-600 font-medium">{{ $student['gender'] }}</td>
    <td class="px-6 py-4 font-semibold text-gray-800">{{ $student['class'] }}</td>
    <td class="px-6 py-4">
        @include('pages.students.partials.status', ['status' => $student['status']])
    </td>
    <td class="px-6 py-4 text-center">
        <a href="{{ route('students.show', $student['id']) }}" class="text-sm font-bold text-primary hover:text-secondary hover:underline transition">
            Details
        </a>
    </td>
</tr>
```
### Data Fallback Empty Component Layout Fragment:
resources/views/pages/students/partials/empty.blade.php
```html
<tr>
    <td colspan="7" class="py-16 bg-gray-50/20">
        <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-gray-200">
                <span class="text-lg text-gray-400 font-bold">?</span>
            </div>
            <h3 class="text-base font-bold text-gray-800 tracking-tight">No Matching Cohorts Present</h3>
            <p class="text-xs font-medium text-gray-400 mt-1">The filtered matching arguments failed to parse successfully into explicit database results.</p>
        </div>
    </td>
</tr>
```
### Form Element Content Field Array Snippet Component:
>resources/views/pages/students/partials/form.blade.php
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Legal Identification Name</label>
        <input type="text" name="name" placeholder="Enter student full name" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Institutional E-Mail Domain</label>
        <input type="email" name="email" placeholder="student.name@rupp.edu.kh" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Identification Assignment</label>
        <select name="gender" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
            <option value="">Select designated sex typing option</option>
            @foreach ($genders as $gender)
                <option value="{{ $gender['name'] }}">
                    {{ $gender['name'] }}
                </option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Course Target Allocation Block</label>
        <input type="text" name="class" placeholder="Example: Laravel Course Group A" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
</div>
```
