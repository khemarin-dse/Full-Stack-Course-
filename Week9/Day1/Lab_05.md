# Lab 5: Database Architecture, Eloquent ORM, and Comprehensive CRUD Integration
## Student Management System (Continuation)

### Submission Checklist
* Print each rendered browser page into a PDF file.
* Submit the PDF files via my personal account telegram or group.

## 1. Persistent Environment Settings & Subsystem Syncing
### Step A: Configure Target Database Architecture (.env)
Update your local environment state fields to use either a clean local file container or a centralized production network adapter:

>SQLite Mode Strategy (Recommended for local lab workflows):

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

>MySQL Workspace Adaption. If your class uses MySQL, use this style instead:
Update `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sms_lab
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Important:**
Security Policy Constraint Matrix: Do not commit explicit, unmasked production passwords or root account access strings into your repository or markdown code handouts.

### Step B: Clear Internal System Config Cache
Force the framework to rebuild operational instances from your modifications:

```bash
php artisan config:clear
```

## 2. Relational Infrastructure Setup: Gender Registry
### Step A: Generate Target Handlers & Model Templates
Execute these commands to build out structural database models, automated table generators, and dataset population hooks:

```bash
php artisan make:model Gender -m
php artisan make:seeder GenderSeeder
```

Laravel will creates:

```text
app/Models/Gender.php
database/migrations/xxxx_xx_xx_create_genders_table.php
database/seeders/GenderSeeder.php
```

### Step B: Establish Structural Gender Schema

>File: `database/migrations/xxxx_xx_xx_create_genders_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('genders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('genders');
    }
};
```

### Step C: Configure Gender Data Model Relationships

>File: `app/Models/Gender.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gender extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Map structured relationship loops out to target dynamic models.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
```

Explanation:

- `$fillable` allows the `name` field to be saved.
- `hasMany(Student::class)` means one gender can have many students.

### Step D: Seed Base Sex Typing System Records

>File: `database/seeders/GenderSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Gender;
use Illuminate\Database\Seeder;

class GenderSeeder extends Seeder
{
    public function run(): void
    {
        $genders = [
            ['name' => 'Male'],
            ['name' => 'Female'],
        ];

        foreach ($genders as $gender) {
            Gender::updateOrCreate(
                ['name' => $gender['name']],
                $gender
            );
        }
    }
}
```

## 3. Application Data Schema Layer: Student Directory

### Step A: Generate Candidate Profile blueprints
>Run:

```bash
php artisan make:model Student -m
php artisan make:seeder StudentSeeder
```
Laravel creates:

```text
app/Models/Student.php
database/migrations/xxxx_xx_xx_create_students_table.php
database/seeders/StudentSeeder.php
```

### Step B: Establish Core Dynamic Student Schema

>File: `database/migrations/xxxx_xx_xx_create_students_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->foreignId('gender_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
```

Explanation:

- `name` stores the student name.
- `email` must be unique.
- `phone` can be empty.
- `gender_id` connects students to the genders table.
- `constrained()` creates the foreign key.
- `cascadeOnDelete()` deletes students when their gender record is deleted.

### Step C: Update Student Data Model Map

>File: app/Models/Student.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'gender_id',
    ];

    /**
     * Deconstruct foreign constraint dependencies into clean entity relationships.
     */
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class);
    }
}
```

Explanation:

- `$fillable` allows these fields to be saved with mass assignment.
- `belongsTo(Gender::class)` means each student belongs to one gender.

### Step D: Populate Master Sample Registry Rows

>File: `database/seeders/StudentSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $maleId = Gender::where('name', 'Male')->value('id');
        $femaleId = Gender::where('name', 'Female')->value('id');

        $students = [
            [
                'name' => 'Sok Dara',
                'email' => 'sok.dara@rupp.edu.kh',
                'phone' => '010 123 123',
                'gender_id' => $maleId,
            ],
            [
                'name' => 'Chan Pisey',
                'email' => 'chan.pisey@rupp.edu.kh',
                'phone' => '011 456 456',
                'gender_id' => $femaleId,
            ],
            [
                'name' => 'Kim Vanna',
                'email' => 'kim.vanna@rupp.edu.kh',
                'phone' => '012 777 888',
                'gender_id' => $maleId,
            ],
            [
                'name' => 'Sros Bopha',
                'email' => 'sros.bopha@rupp.edu.kh',
                'phone' => '015 222 333',
                'gender_id' => $femaleId,
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['email' => $student['email']],
                $student
            );
        }
    }
}
```

### Step E: Register Dependencies inside Database Seeder Orchestrator

>File: `database/seeders/DatabaseSeeder.php`
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // GenderSeeder must run first to prevent foreign key errors
        $this->call([
            GenderSeeder::class,
            StudentSeeder::class,
        ]);
    }
}
```

Important:
Run `GenderSeeder` before `StudentSeeder` because students need `gender_id`.

## 4. Database Reinitialization & Active Testing Execution
Execute fresh table parsing operations and run model verification scripts via terminal commands:

>Run:

```bash
php artisan migrate:fresh --seed
```

This command will:

- Drop old tables
- Create tables again
- Run seeders
- Insert gender and student data

>Operational Verification with Tinker Console:

```bash
php artisan tinker
```

```php
// Run this check snippet in interactive console environment:
\App\Models\Student::with('gender')->get();
```

## 5. Application Routing Matrix Optimization
Transition the limited mapping arrays into a full comprehensive CRUD structural blueprint.

>File: `routes/web.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return view('pages.home');
})->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Open complete endpoint matrices for storage manipulation and resource validation actions
Route::resource('students', StudentController::class);
```

>To review your modern routing matrix topology structure, execute:
```bash
php artisan route:list
```

You should see:

```text
students.index
students.create
students.store
students.show
students.edit
students.update
students.destroy
```

## 6. Controller Subsystem Engine Updates

### Step A: System Analytics Engine Optimization

>File: `app/Http/Controllers/DashboardController.php`

```php
<?php

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
```

### Step B: Core Resource CRUD Engine Engine Implementation

>File: `app/Http/Controllers/StudentController.php`

Replace the old static-data controller with this Eloquent controller:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('gender');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('gender_id')) {
            $query->where('gender_id', $request->gender_id);
        }

        $students = $query->latest()->get();
        $genders = Gender::orderBy('name')->get();

        return view('pages.students.index', [
            'students' => $students,
            'genders' => $genders,
            'search' => $request->search,
            'selectedGender' => $request->gender_id,
        ]);
    }

    public function create()
    {
        $student = new Student();
        $genders = Gender::orderBy('name')->get();
        return view('pages.students.create', compact('student', 'genders'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'gender_id' => ['required', 'exists:genders,id'],
        ]);

        Student::create($validated);

        return redirect()
            ->route('students.index')
            ->with('success', 'Structural profile context compiled and committed to database successfully.');
    }

    public function show(Student $student)
    {
        $student->load('gender');
        return view('pages.students.show', compact('student'));
    }

    public function edit(Student $student)
    {
        $genders = Gender::orderBy('name')->get();
        return view('pages.students.edit', compact('student', 'genders'));
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email,' . $student->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'gender_id' => ['required', 'exists:genders,id'],
        ]);

        $student->update($validated);

        return redirect()
            ->route('students.index')
            ->with('success', 'Candidate profile modifications updated securely.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()
            ->route('students.index')
            ->with('success', 'Student record dropped from active directory registries.');
    }
}
```

## 7. Global Layout Feedback Framework Implementation

Update your system shell UI to capture session parameters in real-time. Append this block immediately above the primary context hook inside your panel workspace framework layout:

>File: `resources/views/layouts/app.blade.php`

```php
@if (session('success'))
    <div class="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 shadow-xs flex items-center gap-2">
        <span>✅</span> {{ session('success') }}
    </div>
@endif

@yield('content')
```

## 8. Interactive Views & Modular Form Layouts

For this lab, make sure these files exist:

```text
resources/views/pages/students/index.blade.php
resources/views/pages/students/create.blade.php
resources/views/pages/students/edit.blade.php
resources/views/pages/students/show.blade.php
resources/views/pages/students/partials/form.blade.php
```

### Step A: Shared Validation Component Form Framework Partial

>File: `resources/views/pages/students/partials/form.blade.php`

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Legal Identification Name</label>
        <input type="text" name="name" value="{{ old('name', $student->name) }}" placeholder="Enter student full name" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('name') border-red-500 focus:ring-red-200 @enderror">
        @error('name')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Institutional E-Mail Domain</label>
        <input type="email" name="email" value="{{ old('email', $student->email) }}" placeholder="student.name@rupp.edu.kh" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('email') border-red-500 focus:ring-red-200 @enderror">
        @error('email')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Identification Assignment</label>
        <select name="gender_id" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('gender_id') border-red-500 focus:ring-red-200 @enderror">
            <option value="">Select designated sex typing option</option>
            @foreach ($genders as $gender)
                <option value="{{ $gender->id }}" @selected(old('gender_id', $student->gender_id) == $gender->id)>
                    {{ $gender->name }}
                </option>
            @endforeach
        </select>
        @error('gender_id')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Mobile Telecom Connection</label>
        <input type="text" name="phone" value="{{ old('phone', $student->phone) }}" placeholder="Example: 010 123 123" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('phone') border-red-500 focus:ring-red-200 @enderror">
        @error('phone')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>
</div>
```

### Step B: Master Registry Data Directory Interface View

>File: `resources/views/pages/students/index.blade.php`

```html
@extends('layouts.app')
@section('title', 'Student Registry Records Engine')
@section('parent', 'Student Management')
@section('page', 'Master Data Directory')
@section('content')
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Active Directory Sheets</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">Evaluate structural Eloquent relationships and active model storage behaviors.</p>
        </div>
        <x-button :href="route('students.create')" variant="primary">Add Student UI</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Search Query String</label>
                <input type="text" name="search" value="{{ $search }}" placeholder="Search by name, email, phone..." class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Category Filter</label>
                <select name="gender_id" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="">All Genders Available</option>
                    @foreach ($genders as $gender)
                        <option value="{{ $gender->id }}" @selected($selectedGender == $gender->id)>{{ $gender->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-grow bg-primary hover:bg-secondary text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer">Execute Filter</button>
                <a href="{{ route('students.index') }}" class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm px-5 py-2.5 rounded-xl transition text-center flex items-center justify-center">Clear Filters</a>
            </div>
        </form>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">UID</th>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Mailing Location</th>
                        <th class="px-6 py-4">Phone Connection</th>
                        <th class="px-6 py-4">Gender Group</th>
                        <th class="px-6 py-4 text-center">Action Parameters</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    @forelse ($students as $student)
                        <tr class="hover:bg-gray-50/50 border-t border-gray-100 transition">
                            <td class="px-6 py-4 text-xs font-mono text-gray-400">#00{{ $student->id }}</td>
                            <td class="px-6 py-4 font-bold text-gray-900">{{ $student->name }}</td>
                            <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ $student->email }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ $student->phone ?? 'N/A' }}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold {{ $student->gender?->name === 'Male' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-pink-50 border border-pink-200 text-pink-700' }}">
                                    {{ $student->gender?->name ?? 'Unassigned' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center items-center gap-4">
                                    <a href="{{ route('students.show', $student) }}" class="text-xs font-bold text-primary hover:underline">Details</a>
                                    <a href="{{ route('students.edit', $student) }}" class="text-xs font-bold text-amber-600 hover:underline">Edit Workspace</a>
                                    
                                    <form method="POST" action="{{ route('students.destroy', $student) }}" onsubmit="return confirm('Confirm permanent deletion sequence for this record instance?')" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer bg-transparent border-none p-0">Drop</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="py-16 bg-gray-50/20">
                                <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-gray-200">
                                        <span class="text-lg text-gray-400 font-bold">?</span>
                                    </div>
                                    <h3 class="text-base font-bold text-gray-800 tracking-tight">No Matching Candidates Present</h3>
                                    <p class="text-xs font-medium text-gray-400 mt-1">Eloquent query builder returned empty result matrices.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
```

### Step C: Target Storage Insertion Layout View

>File: `resources/views/pages/students/create.blade.php`

```html
@extends('layouts.app')
@section('title', 'Register New Candidate Workspace')
@section('parent', 'Student Management')
@section('page', 'Create Record Instance UI')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Add New Registration</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">Commits validated form payloads directly through the database model layers.</p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Discard Changes</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <form action="{{ route('students.store') }}" method="POST" class="space-y-6">
            @csrf
            @include('pages.students.partials.form')
            
            <div class="border-t border-gray-100 pt-6 flex justify-end gap-3">
                <a href="{{ route('students.index') }}" class="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition shadow-xs">Cancel</a>
                <button type="submit" class="bg-primary hover:bg-secondary text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer">Save Student Record</button>
            </div>
        </form>
    </div>
</div>
@endsection
```

### Step D: Active Record Modification/Edit Panel Workspace Layout View

>File: `resources/views/pages/students/edit.blade.php`

```html
@extends('layouts.app')
@section('title', 'Modify Existing Student Profile')
@section('parent', 'Student Management')
@section('page', 'Update Profile Workspace')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Update Student: {{ $student->name }}</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">This transaction updates target field constraints inside active SQL engines.</p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Discard Changes</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <form action="{{ route('students.update', $student) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            @include('pages.students.partials.form')
            
            <div class="border-t border-gray-100 pt-6 flex justify-end gap-3">
                <a href="{{ route('students.index') }}" class="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition shadow-xs">Cancel Configuration</a>
                <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer">Commit Updates</button>
            </div>
        </form>
    </div>
</div>
@endsection
```

### Step E: Detailed Profile Dossier Interface view

>File: `resources/views/pages/students/show.blade.php`

```html
@extends('layouts.app')
@section('title', 'Student Profile Dossier')
@section('parent', 'Student Management')
@section('page', 'Detailed Record Dossier')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
                {{ $student->name }}
            </h1>
            <p class="text-xs font-bold text-primary px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md inline-block mt-1">
                Database System ID: #00{{ $student->id }}
            </p>
        </div>
        <div class="flex gap-2">
            <x-button :href="route('students.index')" variant="secondary">Back to Registry</x-button>
            <a href="{{ route('students.edit', $student) }}" class="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition transform active:scale-95 duration-100">Modify Data</a>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Legal Surname & Name</p>
            <p class="font-bold text-gray-900 text-lg mt-1">{{ $student->name }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Communication Endpoint</p>
            <p class="font-mono text-sm text-primary font-bold mt-1">{{ $student->email }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Mobile Telecom Connection</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student->phone ?? 'Data Struct Null' }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Gender Orientation Identity</p>
            <div class="mt-1">
                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold {{ $student->gender?->name === 'Male' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-pink-50 border border-pink-200 text-pink-700' }}">
                    {{ $student->gender?->name ?? 'Database Null Constraint' }}
                </span>
            </div>
        </div>
    </div>
</div>
@endsection
```
### Step F: The Complete Dashboard Interface View
Ensure your view remains clean, styled with your designated color tokens, and uses the correct variable parameters:
>File: `resources/views/pages/dashboard/index.blade.php`
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
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Gender Sub-Groups</p>
            <h3 class="text-3xl font-black text-green-600 mt-2 tracking-tight">{{ $totalGenders }}</h3>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 class="text-lg font-bold text-gray-900 tracking-tight">Recent Registered Profiles</h2>
                <p class="text-xs text-gray-400 mt-0.5">Dynamic data requested via active Eloquent relationship maps.</p>
            </div>
            <x-button :href="route('students.index')" variant="secondary">Manage All</x-button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">Index</th>
                        <th class="px-6 py-4">Full Name</th>
                        <th class="px-6 py-4">Email Address</th>
                        <th class="px-6 py-4">Phone Number</th>
                        <th class="px-6 py-4">Gender Group</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-medium text-sm text-gray-700">
                    @foreach ($recentStudents as $student)
                        <tr class="hover:bg-gray-50/50 transition">
                            <td class="px-6 py-3.5 text-gray-400">{{ $loop->iteration }}</td>
                            <td class="px-6 py-3.5 font-bold text-gray-900">{{ $student->name }}</td>
                            <td class="px-6 py-3.5 font-mono text-xs text-gray-500">{{ $student->email }}</td>
                            <td class="px-6 py-3.5 text-gray-600">{{ $student->phone ?? 'N/A' }}</td>
                            <td class="px-6 py-3.5">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold {{ $student->gender?->name === 'Male' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-pink-50 border border-pink-200 text-pink-700' }}">
                                    {{ $student->gender?->name ?? 'Unassigned' }}
                                </span>
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