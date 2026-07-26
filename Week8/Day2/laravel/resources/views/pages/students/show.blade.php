@extends('layouts.app')
@section('title', 'Student Profile Dossier')
@section('parent', 'Registry Dossier')
@section('page', 'Detailed Record Dossier')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
                {{ $student['name'] }}
            </h1>
            <p class="text-xs font-bold text-primary px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md inline-block mt-1">
                UID String: #00{{ $student['id'] }}
            </p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Back to Registry</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Legal Surname & Name</p>
            <p class="font-bold text-gray-900 text-lg mt-1">{{ $student['name'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Communication Endpoint</p>
            <p class="font-mono text-sm text-primary font-bold mt-1">{{ $student['email'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Mobile Telecom Connection</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student['phone'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Gender Orientation Identity</p>
            <p class="font-semibold text-gray-800 mt-1">{{ $student['gender'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">Class Cohort Group Allocation</p>
            <p class="font-bold text-primary mt-1">{{ $student['class'] }}</p>
        </div>
        <div>
            <p class="text-xs font-bold uppercase text-gray-400 tracking-wider">System Operational State</p>
            <div class="mt-2">
                @include('pages.students.partials.status', ['status' => $student['status']])
            </div>
        </div>
    </div>
</div>
@endsection