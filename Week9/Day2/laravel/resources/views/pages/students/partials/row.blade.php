<tr class="hover:bg-gray-50/50 border-t border-gray-100 transition">
    <td class="px-6 py-4 text-xs text-gray-400">{{ $loop->iteration }}</td>
    <td class="px-6 py-4 font-bold text-gray-900">{{ $student['name'] }}</td>
    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ $student['email'] }}</td>
    <td class="px-6 py-4 text-gray-600 font-medium">{{ $student['gender'] }}</td>
    <td class="px-6 py-4 font-semibold text-gray-800">{{ $student['class'] }}</td>
    <td class="px-6 py-4">
        @include('pages.students.partials.status', ['status' => $student['status']])
    </td>
    <td class="px-6 py-4 text-center">
        <a href="{{ route('students.show', $student['id']) }}" class="text-sm font-bold text-primary hover:text-secondary hover:underline transition">
            Details
        </a>
    </td>
</tr>