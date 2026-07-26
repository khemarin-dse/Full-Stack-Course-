@props(['menus' => []])

<aside id="sidebar" class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 md:block hidden">
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <a href="{{ route('dashboard') }}" class="flex items-center space-x-2">
            <span class="text-sm font-black tracking-wider uppercase text-gray-900">SMS Portal</span>
        </a>
    </div>

    <nav class="p-4 space-y-4 flex-1 overflow-y-auto">
        @foreach ($menus as $menu)
            @if (isset($menu['group']))
                <div class="space-y-1">
                    <p class="px-4 text-xs font-bold uppercase text-gray-400 tracking-wider">
                        {{ $menu['group'] }}
                    </p>
                    @foreach ($menu['items'] as $item)
                        <a href="{{ route($item['route']) }}" 
                           class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition font-semibold {{ request()->routeIs($item['route']) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700' }}">
                            <i class="{{ $item['icon'] }} text-base w-5 text-center"></i>
                            <span>{{ $item['title'] }}</span>
                        </a>
                    @endforeach
                </div>
            @else
                <a href="{{ route($menu['route']) }}" 
                   class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition font-semibold {{ request()->routeIs($menu['route']) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700' }}">
                    <i class="{{ $menu['icon'] }} text-base w-5 text-center"></i>
                    <span>{{ $menu['title'] }}</span>
                </a>
            @endif
        @endforeach
    </nav>
</aside>