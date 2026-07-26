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