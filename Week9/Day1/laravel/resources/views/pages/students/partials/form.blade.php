<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Legal Identification Name</label>
        <input type="text" name="name" value="{{ old('name', $student->name) }}" placeholder="Enter student full name" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('name') border-red-500 focus:ring-red-200 @enderror">
        @error('name')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Institutional E-Mail Domain</label>
        <input type="email" name="email" value="{{ old('email', $student->email) }}" placeholder="student.name@rupp.edu.kh" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('email') border-red-500 focus:ring-red-200 @enderror">
        @error('email')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Identification Assignment</label>
        <select name="gender_id" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('gender_id') border-red-500 focus:ring-red-200 @enderror">
            <option value="">Select designated sex typing option</option>
            @foreach ($genders as $gender)
                <option value="{{ $gender->id }}" @selected(old('gender_id', $student->gender_id) == $gender->id)>
                    {{ $gender->name }}
                </option>
            @endforeach
        </select>
        @error('gender_id')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Mobile Telecom Connection</label>
        <input type="text" name="phone" value="{{ old('phone', $student->phone) }}" placeholder="Example: 010 123 123" class="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white border-gray-300 transition focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none @error('phone') border-red-500 focus:ring-red-200 @enderror">
        @error('phone')
            <p class="mt-1.5 text-xs font-semibold text-red-500">{{ $message }}</p>
        @enderror
    </div>
</div>