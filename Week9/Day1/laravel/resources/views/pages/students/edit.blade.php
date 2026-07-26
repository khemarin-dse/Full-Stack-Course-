@extends('layouts.app')
@section('title', 'Modify Existing Student Profile')
@section('parent', 'Student Management')
@section('page', 'Update Profile Workspace')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Update Student: {{ $student->name }}</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">This transaction updates target field constraints inside active SQL engines.</p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Discard Changes</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <form action="{{ route('students.update', $student) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            @include('pages.students.partials.form')
            
            <div class="border-t border-gray-100 pt-6 flex justify-end gap-3">
                <a href="{{ route('students.index') }}" class="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition shadow-xs">Cancel Configuration</a>
                <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer">Commit Updates</button>
            </div>
        </form>
    </div>
</div>
@endsection