@props([
    'href' => null,
    'type' => 'button',
    'variant' => 'primary',
])

@php
    $variants = [
        'primary' => 'bg-primary hover:bg-secondary text-white shadow-xs',
        'secondary' => 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-xs',
        'danger' => 'bg-red-600 hover:bg-red-700 text-white shadow-xs',
    ];

    $classes = 'inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full text-sm transition transform active:scale-95 duration-100 ' . $variants[$variant];
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' =>$classes]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' =>$classes]) }}>
        {{ $slot }}
    </button>
@endif