@extends('layouts.app')
@section('title', 'Student Profile Dossier')
@section('parent', 'Student Management')
@section('page', 'Detailed Record Dossier')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
                {{ $student->name }}
            </h1>
            <p class="text-xs font-bold text-primary px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md inline-block mt-1">
                Database System ID: #00{{ $student->id }}
            </p>
        </div>
        <div class="flex gap-2">
            <x-button :href="route('students.index')" variant="secondary">Back to Registry</x-button>
            <a href="{{ route('students.edit', $student) }}" class="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition transform active:scale-95 duration-100">Modify Data</a>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Legal Surname & Name</p>
            <p class="font-bold text-gray-900 text-lg mt-1">{{ $student->name }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Communication Endpoint</p>
            <p class="font-mono text-sm text-primary font-bold mt-1">{{ $student->email }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Mobile Telecom Connection</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student->phone ?? 'Data Struct Null' }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Gender Orientation Identity</p>
            <div class="mt-1">
                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold {{ $student->gender?->name === 'Male' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-pink-50 border border-pink-200 text-pink-700' }}">
                    {{ $student->gender?->name ?? 'Database Null Constraint' }}
                </span>
            </div>
        </div>
    </div>
</div>
@endsection