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