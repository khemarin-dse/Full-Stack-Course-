@extends('layouts.app')
@section('title', 'Student Registry Records Engine')
@section('parent', 'Students Registry')
@section('page', 'Master Data Directory')
@section('content')
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Active Directory Sheets</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">Evaluate structural routing parameters, request filtering validations and custom inclusion loops.</p>
        </div>
        <x-button :href="route('students.create')" variant="primary">Add Student UI</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Search Query String</label>
                <input type="text" name="search" value="{{ $search }}" placeholder="Search by name, email, or course cohort..." class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Category Filter</label>
                <select name="gender" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="">All Genders Available</option>
                    @foreach ($genders as $gender)
                        <option value="{{ $gender['name'] }}" @selected($selectedGender === $gender['name'])>{{$gender['name'] }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-grow bg-primary hover:bg-secondary text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer">Execute Filter</button>
                <a href="{{ route('students.index') }}" class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm px-5 py-2.5 rounded-xl transition text-center flex items-center justify-center">Clear Filters</a>
            </div>
        </form>
        @if ($search || $selectedGender)
            <div class="mt-4 flex items-center text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg w-max">
                ⚠️ Workspace parameters are currently applied.
            </div>
        @endif
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">Index</th>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Mailing Location</th>
                        <th class="px-6 py-4">Gender</th>
                        <th class="px-6 py-4">Assigned Course</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4 text-center">Action Parameters</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    @forelse ($students as $student)
                        @include('pages.students.partials.row', ['student' => $student])
                    @empty
                        @include('pages.students.partials.empty')
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection