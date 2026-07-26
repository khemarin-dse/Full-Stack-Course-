@extends('layouts.app')
@section('title', 'Student Registry Records Engine')
@section('parent', 'Student Management')
@section('page', 'Master Data Directory')
@section('content')
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Active Directory Sheets</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">Evaluate structural Eloquent relationships and active model storage behaviors.</p>
        </div>
        <x-button :href="route('students.create')" variant="primary">Add Student UI</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Search Query String</label>
                <input type="text" name="search" value="{{ $search }}" placeholder="Search by name, email, phone..." class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Category Filter</label>
                <select name="gender_id" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option value="">All Genders Available</option>
                    @foreach ($genders as $gender)
                        <option value="{{ $gender->id }}" @selected($selectedGender == $gender->id)>{{ $gender->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex gap-2">
                <button type="submit" class="flex-grow bg-primary hover:bg-secondary text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer">Execute Filter</button>
                <a href="{{ route('students.index') }}" class="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm px-5 py-2.5 rounded-xl transition text-center flex items-center justify-center">Clear Filters</a>
            </div>
        </form>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                        <th class="px-6 py-4">UID</th>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Mailing Location</th>
                        <th class="px-6 py-4">Phone Connection</th>
                        <th class="px-6 py-4">Gender Group</th>
                        <th class="px-6 py-4 text-center">Action Parameters</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    @forelse ($students as $student)
                        <tr class="hover:bg-gray-50/50 border-t border-gray-100 transition">
                            <td class="px-6 py-4 text-xs font-mono text-gray-400">#00{{ $student->id }}</td>
                            <td class="px-6 py-4 font-bold text-gray-900">{{ $student->name }}</td>
                            <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ $student->email }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ $student->phone ?? 'N/A' }}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold {{ $student->gender?->name === 'Male' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-pink-50 border border-pink-200 text-pink-700' }}">
                                    {{ $student->gender?->name ?? 'Unassigned' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center items-center gap-4">
                                    <a href="{{ route('students.show', $student) }}" class="text-xs font-bold text-primary hover:underline">Details</a>
                                    <a href="{{ route('students.edit', $student) }}" class="text-xs font-bold text-amber-600 hover:underline">Edit Workspace</a>
                                    
                                    <form method="POST" action="{{ route('students.destroy', $student) }}" onsubmit="return confirm('Confirm permanent deletion sequence for this record instance?')" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer bg-transparent border-none p-0">Drop</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="py-16 bg-gray-50/20">
                                <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-gray-200">
                                        <span class="text-lg text-gray-400 font-bold">?</span>
                                    </div>
                                    <h3 class="text-base font-bold text-gray-800 tracking-tight">No Matching Candidates Present</h3>
                                    <p class="text-xs font-medium text-gray-400 mt-1">Eloquent query builder returned empty result matrices.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection