<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Student</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-55 text-gray-800 font-sans min-h-screen p-8">
    <div class="container mx-auto max-w-xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">Register New Student</h1>
        
        <div class="space-y-4 mb-8">
            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Sok Dara" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Class Option</label>
                <input type="text" placeholder="e.g. M1" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200">
            </div>
        </div>

        <div class="border-t pt-4 flex items-center justify-between">
            <button class="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg opacity-70 cursor-not-allowed">Submit Record</button>
            <a href="{{ route('students.index') }}" class="text-sm font-medium text-gray-500 hover:text-blue-600 transition flex items-center">
                &larr; Back to Student Directory
            </a>
        </div>
    </div>
</body>
</html>