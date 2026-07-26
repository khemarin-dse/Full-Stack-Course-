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
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Active Enrollment Status</p>
            <h3 class="text-3xl font-black text-green-600 mt-2 tracking-tight">{{ $activeStudents }}</h3>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
                <h2 class="text-lg font-bold text-gray-900 tracking-tight">Recent Registered Profiles</h2>
                <p class="text-xs text-gray-400 mt-0.5">Dynamic collection models requested straight from core service app/Services/Data.php</p>
            </div>
            <x-button :href="route('students.index')" variant="secondary">Manage All</x-button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">Index</th>
                        <th class="px-6 py-4">Full Name</th>
                        <th class="px-6 py-4">Email</th>
                        <th class="px-6 py-4">Gender Group</th>
                        <th class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-medium text-sm text-gray-700">
                    @foreach ($recentStudents as $student)
                        <tr class="hover:bg-gray-50/50 transition">
                            <td class="px-6 py-3.5 text-gray-400">{{ $loop->iteration }}</td>
                            <td class="px-6 py-3.5 font-bold text-gray-900">{{ $student['name'] }}</td>
                            <td class="px-6 py-3.5 font-mono text-xs text-gray-500">{{ $student['email'] }}</td>
                            <td class="px-6 py-3.5 text-gray-600">{{ $student['gender'] }}</td>
                            <td class="px-6 py-3.5">
                                @include('pages.students.partials.status', ['status' => $student['status']])
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection