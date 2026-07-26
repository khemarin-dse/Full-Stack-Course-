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