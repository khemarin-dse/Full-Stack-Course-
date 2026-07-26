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