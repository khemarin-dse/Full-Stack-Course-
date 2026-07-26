@extends('layouts.guest')
@section('title', 'Student Management System')
@section('content')
<div class="min-h-[80vh] flex items-center justify-center px-6 bg-linear-to-b from-blue-50/50 to-transparent">
    <div class="max-w-3xl text-center">
        <span class="bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Royal University of Phnom Penh</span>
        <h1 class="text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6">
            Core Student Registry <br><span class="text-primary">Management Workspace</span>
        </h1>
        <p class="text-gray-500 mt-6 text-lg max-w-xl mx-auto leading-relaxed">
            Practice structural Laravel route architectures, parameters validation filters, template controllers, component contexts, and customized template partial compilation loops.
        </p>
        <div class="mt-8 flex justify-center gap-4">
            <x-button :href="route('dashboard')" variant="primary">Launch Workspace</x-button>
            <x-button :href="route('students.index')" variant="secondary">Browse Student Records</x-button>
        </div>
    </div>
</div>
@endsection