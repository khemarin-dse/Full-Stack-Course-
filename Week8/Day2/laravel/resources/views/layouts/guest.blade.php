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