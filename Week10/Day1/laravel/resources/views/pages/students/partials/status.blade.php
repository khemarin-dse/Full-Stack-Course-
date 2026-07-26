@switch($status)
    @case('Active')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700">Active</span>
        @break
    @case('Pending')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-600">Pending</span>
        @break
    @case('Inactive')
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-600">Inactive</span>
        @break
    @default
        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600">Unknown</span>
@endswitch