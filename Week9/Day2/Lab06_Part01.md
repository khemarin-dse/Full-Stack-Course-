# Lab 6 - Part 01: Authentication Infrastructure with Laravel Breeze
## Student Management System (Continuation)
### Submission Checklist
* Print each rendered browser page into a PDF file.
* Submit the PDF files via my personal account telegram or group.

## 1. Authentication Layer Scaffolding & State Synchronization
### Step 1: Install Laravel Breeze Subsystem
Execute the package orchestration and installation matrix commands to securely inject lightweight authentication scaffolds into the application architecture:

>Run:

```bash
# Require Laravel Breeze
composer require laravel/breeze --dev

# Install Breeze
php artisan breeze:install blade

# Install frontend dependencies
npm install
npm run dev

# Run database migrations
php artisan migrate
```

Breeze hooks standard core operational controllers, views, and routing tables into your directory tree automatically:
```text
routes/auth.php — Enforces authentication lifecycle endpoint logic mapping.

resources/views/auth/login.blade.php — Active directory login interface panel view.

resources/views/auth/register.blade.php — Identity creation portal interface layout.

app/Http/Controllers/Auth/AuthenticatedSessionController.php — Session initialization vehicle engine.

app/Http/Controllers/Auth/RegisteredUserController.php — Profile verification state parser.
```

### Step 2: Operational Cache Storage Migration
Publish the caching engine storage table structures to hold user authentication, state caching, and throttling metrics securely:
>Run:

```bash
# Publish the cache table migration
php artisan make:cache-table

# Run the migration
php artisan migrate
```

>**Framework Fallback Note:** If your configuration environment operates on older application scaffolding signatures, construct the storage layouts using this alternative matrix signature instead:

## 2. Default Administrative Credential Seeding

### Step 1: Generate Master User Population Seeder

Construct an identity population script mapping to generate automated administrative credentials for login validation verification routines:

>Run:

```bash
php artisan make:seeder UserSeeder
```
### Step2: : Configure Master Admin Credentials Mapping
>File: `database/seeders/UserSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the application database seed matrix.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );
    }
}
```
### Step3: Update Master Database Seeder Orchestrator
>File: `database/seeders/DatabaseSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Coordinate system sequence data seeds.
     */
    public function run(): void
    {
        // Enforce execution matrices sequentially to protect relationship keys
        $this->call([
            UserSeeder::class,
            GenderSeeder::class,
            StudentSeeder::class,
        ]);
    }
}
```
Execute the database parsing seed routine to instantiate the new identity values within the persistent structures:
>Run:

```bash
php artisan db:seed
```

Master Test Console Credentials Array:

```text
Email Access Identifier: admin@example.com
Secret Token Key: password
```

## 3. Session Lifecycle & Redirection Routing Updates

Modify the transaction handlers inside the authentication core layer to bypass Breeze default paths and guide user workflows to the primary SMS metric workspace.

>File: `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

### Step 1: Update Session Initialization Pipeline (store)
Locate the operational store() transaction sequence block and redirect authenticated queries:
```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();

    $request->session()->regenerate();

    // Redirect the session thread directly to the custom dashboard matrix
    return redirect()->intended(route('dashboard'));
}
```

### Step 2: Update Session Termination Pipeline (destroy)
Update the system destroy() routine block to control application exit flows cleanly:
```php
public function destroy(Request $request): RedirectResponse
{
    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    // Route the visitor back to the public root landing zone
    return redirect('/');
}
```

## 4. Master Shell UI Layout Integration
Inject authorization checks, dynamically parsed active user signatures, and protected session access buttons straight into the application core layout framework.

### Step 1: Create a new file at resources/views/components/sidebar.blade.php and add the following implementation to parse your dynamic menu structure:
>File: `resources/views/components/sidebar.blade.php`

```html
@props(['menus' => []])

<aside id="sidebar" class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 md:block hidden">
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <a href="{{ route('dashboard') }}" class="flex items-center space-x-2">
            <span class="text-sm font-black tracking-wider uppercase text-gray-900">SMS Portal</span>
        </a>
    </div>

    <nav class="p-4 space-y-4 flex-1 overflow-y-auto">
        @foreach ($menus as $menu)
            @if (isset($menu['group']))
                <div class="space-y-1">
                    <p class="px-4 text-xs font-bold uppercase text-gray-400 tracking-wider">
                        {{ $menu['group'] }}
                    </p>
                    @foreach ($menu['items'] as $item)
                        <a href="{{ route($item['route']) }}" 
                           class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition font-semibold {{ request()->routeIs($item['route']) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700' }}">
                            <i class="{{ $item['icon'] }} text-base w-5 text-center"></i>
                            <span>{{ $item['title'] }}</span>
                        </a>
                    @endforeach
                </div>
            @else
                <a href="{{ route($menu['route']) }}" 
                   class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition font-semibold {{ request()->routeIs($menu['route']) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700' }}">
                    <i class="{{ $menu['icon'] }} text-base w-5 text-center"></i>
                    <span>{{ $menu['title'] }}</span>
                </a>
            @endif
        @endforeach
    </nav>
</aside>
```

>File: `resources/views/layouts/app.blade.php`

```php
@php
    $menus = [
        [
            'title' => 'Dashboard',
            'route' => 'dashboard',
            'icon' => 'fas fa-tachometer-alt',
        ],
        [
            'group' => 'Management',
            'items' => [
                [
                    'title' => 'Students',
                    'route' => 'students.index',
                    'icon' => 'fas fa-user-graduate',
                ],
                [
                    'title' => 'Genders',
                    'route' => 'genders.index',
                    'icon' => 'fas fa-venus-mars',
                ],
            ],
        ],
    ];
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body class="bg-gray-100 font-sans">
    <div class="flex min-h-screen flex-col md:flex-row">
        <x-sidebar :menus="$menus" />

        <div class="flex flex-1 flex-col overflow-hidden bg-white">
            <main class="h-screen flex-1 overflow-y-auto">
                <header class="mb-6 flex items-center justify-between border-b border-gray-300 p-6">
                    <button type="button" onclick="toggleSidebar()" class="text-xl text-primary transition-colors hover:text-secondary">
                        <i class="fas fa-bars"></i>
                    </button>

                    <div class="flex items-center gap-4">
                        <span class="text-sm text-gray-600 font-medium">
                            Welcome, {{ Auth::user()->name }}
                        </span>

                        <a href="{{ route('profile.edit') }}" class="text-sm font-bold text-primary hover:text-secondary hover:underline transition">
                            Profile
                        </a>

                        <form action="{{ route('logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 shadow-xs cursor-pointer">
                                Logout
                            </button>
                        </form>
                    </div>
                </header>

                <div class="px-6">
                    <div class="mt-1 flex items-center gap-2 text-2xl font-black text-gray-900 tracking-tight">
                        @hasSection('parent')
                            <span class="text-gray-400">@yield('parent')</span>
                        @endif

                        @hasSection('page')
                            <span class="text-gray-300 font-normal text-xl">></span>
                            <span class="text-primary">@yield('page')</span>
                        @endif
                    </div>

                    <div class="mt-6">
                        @if (session('success'))
                            <div class="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 shadow-xs flex items-center gap-2">
                                <span>✅</span> {{ session('success') }}
                            </div>
                        @endif

                        @if (session('error'))
                            <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-xs flex items-center gap-2">
                                <span>⚠️</span> {{ session('error') }}
                            </div>
                        @endif

                        @yield('content')
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>
```

## 5. Guest Authentication Template Styling Sync

Rewrite the default Breeze guest entry framework interface layouts to visually correspond with the system CSS colors and rounded design schemas.

>File: `resources/views/layouts/guest.blade.php`

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Student Management System</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-gray-100 font-sans text-gray-900 selection:bg-primary/10">
    <div class="flex min-h-screen items-center justify-center px-6 py-12">
        <div class="w-full max-w-md">
            <div class="mb-8 text-center">
                <a href="/" class="text-4xl font-black text-primary tracking-tighter">
                    SMS
                </a>
                <p class="mt-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Student Management System Platform
                </p>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
                {{ $slot }}
            </div>
        </div>
    </div>
</body>
</html>
```

## 6. Route Security & Access Boundary Constraints

Modify the top-level route definitions to pass all Student Management System view scripts, endpoints, and records builders through the standard middleware constraint system.

>File: routes/web.php

```php
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
```

Result:

- Guest users can see the welcome, login, and register pages.
- Logged-in users can access dashboard, students, genders, and profile.

## 7. Interactive Welcome Presentation View Update
Modify the public-facing entry route layout template file to evaluate active session scopes cleanly using standard directive conditions.
>File: resources/views/welcome.blade.php

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-gray-100 font-sans text-gray-900">
    <header class="border-b border-gray-200 bg-white shadow-xs">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <a href="/" class="text-2xl font-black text-primary tracking-tight">
                SMS
            </a>

            <div class="flex items-center gap-3">
                @auth
                    <a href="{{ route('dashboard') }}" class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary transition shadow-xs">
                        Workspace Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                        Login Signature
                    </a>

                    <a href="{{ route('register') }}" class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary transition shadow-xs">
                        Register Account
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <main>
        <section class="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
            <div class="space-y-6">
                <p class="text-xs font-bold uppercase tracking-widest text-secondary">
                    Laravel Practice Configuration Blueprint
                </p>

                <h1 class="text-4xl font-black leading-none text-gray-900 md:text-6xl tracking-tighter">
                    Student Management <br><span class="text-primary">System Core</span>
                </h1>

                <p class="text-base text-gray-500 font-medium max-w-md leading-relaxed">
                    Coordinate live model data records registries, dynamic relational Eloquent mappings, and modern tokenized session authentication layer systems in a safe, performant environment sheet.
                </p>

                <div class="flex gap-3 pt-2">
                    @auth
                        <a href="{{ route('dashboard') }}" class="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-secondary transition shadow-sm">
                            Access Your Workspace
                        </a>
                    @else
                        <a href="{{ route('register') }}" class="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-secondary transition shadow-sm">
                            Initialize Get Started Sequence
                        </a>

                        <a href="{{ route('login') }}" class="rounded-full border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 hover:bg-gray-50 transition shadow-xs">
                            Sign In Profile
                        </a>
                    @endauth
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <div class="grid gap-4">
                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Protected Dashboard Framework</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Session-guarded middleware groups shield all underlying records sheets from structural leakage.</p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Relational Student CRUD Engine</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Create, parse, evaluate, update, or discard complex entities lists using clean automated UI models.</p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Gender Category Submapping</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Maintains reference table relationships via relational foreign keys and constraint hooks.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
```
## 8. Implement Controoler Gender
### Step 1: Generate the Missing Controller
You need to generate the `GenderController` class using the Artisan CLI. Open your terminal at your project root directory and run the following command:
```base
php artisan make:controller GenderController --resource
```
>**Note:** The --resource flag is highly recommended here because it generates the boilerplate methods (index, create, store, show, edit, update, destroy) required to back full CRUD resource mappings.

### Step 2: Implement the Controller Logic
Open your newly created file at `app/Http/Controllers/GenderController.php` and make sure it loads your Eloquent datasets properly:
```php
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
```

## 9. Development Compilation Server & Workspace Verification
To complete your lab setup, initiate your background process engine operations and perform sequence walkthrough tasks:
>Run:

```bash
# Start your local system request handling web server instance
php artisan serve

# Keep the Vite compiler operational to continuously process template changes
npm run dev
```

## Authentication Architecture Validation Blueprint Steps
```text
1. Request access directly to http://127.0.0.1:8000 via a standard clean browser instance window.

2. Select the Register element control field and perform a registration payload execution pass.

3. Terminate your active workspace configuration mapping using the Logout interface button.

4. Attempt a fresh log entry path matching the hardcoded data matrix arrays: Access with ID admin@example.com combined with the secret token key password.

5. Browse manually down structural records subpaths (/dashboard, /students).

6. Dispatch a termination process request command and attempt a direct forced URL request pass toward /students.

7. Expected Access Isolation Result Architecture Matrix Behavior: The security context intercepts unauthorized navigation attempts and dynamically routes the browser stream back to the login authentication template pane.
```