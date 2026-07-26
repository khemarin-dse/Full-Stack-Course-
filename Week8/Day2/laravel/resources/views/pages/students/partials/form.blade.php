<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Legal Identification Name</label>
        <input type="text" name="name" placeholder="Enter student full name" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Institutional E-Mail Domain</label>
        <input type="email" name="email" placeholder="student.name@rupp.edu.kh" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Gender Identification Assignment</label>
        <select name="gender" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
            <option value="">Select designated sex typing option</option>
            @foreach ($genders as $gender)
                <option value="{{ $gender['name'] }}">
                    {{ $gender['name'] }}
                </option>
            @endforeach
        </select>
    </div>
    <div>
        <label class="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Course Target Allocation Block</label>
        <input type="text" name="class" placeholder="Example: Laravel Course Group A" class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none bg-white">
    </div>
</div>