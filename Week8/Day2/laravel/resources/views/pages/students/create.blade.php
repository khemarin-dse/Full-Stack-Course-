@extends('layouts.app')
@section('title', 'Register New Candidate Workspace')
@section('parent', 'Students Entry')
@section('page', 'Create Record Instance UI')
@section('content')
<div class="max-w-3xl space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-black text-gray-900 tracking-tight">Add New Registration</h1>
            <p class="text-xs text-gray-400 font-medium mt-0.5">This view template operates exclusively for custom parameter structuring layout validation tests.</p>
        </div>
        <x-button :href="route('students.index')" variant="secondary">Discard Changes</x-button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <form action="{{ route('students.index') }}" method="GET" class="space-y-6">
            @include('pages.students.partials.form')
            
            <div class="border-t border-gray-100 pt-6 flex justify-end gap-3">
                <x-button :href="route('students.index')" variant="secondary">Cancel Space</x-button>
                <button type="submit" class="bg-primary hover:bg-secondary text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-xs cursor-pointer">Save UI Context Sample</button>
            </div>
        </form>
    </div>
</div>
@endsection