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