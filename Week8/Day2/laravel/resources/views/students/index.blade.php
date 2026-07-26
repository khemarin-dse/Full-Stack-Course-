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