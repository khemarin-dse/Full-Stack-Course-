<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-gray-100 font-sans text-gray-900">
    <header class="border-b border-gray-200 bg-white shadow-xs">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <a href="/" class="text-2xl font-black text-primary tracking-tight">
                SMS
            </a>

            <div class="flex items-center gap-3">
                @auth
                    <a href="{{ route('dashboard') }}" class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary transition shadow-xs">
                        Workspace Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                        Login Signature
                    </a>

                    <a href="{{ route('register') }}" class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary transition shadow-xs">
                        Register Account
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <main>
        <section class="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
            <div class="space-y-6">
                <p class="text-xs font-bold uppercase tracking-widest text-secondary">
                    Laravel Practice Configuration Blueprint
                </p>

                <h1 class="text-4xl font-black leading-none text-gray-900 md:text-6xl tracking-tighter">
                    Student Management <br><span class="text-primary">System Core</span>
                </h1>

                <p class="text-base text-gray-500 font-medium max-w-md leading-relaxed">
                    Coordinate live model data records registries, dynamic relational Eloquent mappings, and modern tokenized session authentication layer systems in a safe, performant environment sheet.
                </p>

                <div class="flex gap-3 pt-2">
                    @auth
                        <a href="{{ route('dashboard') }}" class="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-secondary transition shadow-sm">
                            Access Your Workspace
                        </a>
                    @else
                        <a href="{{ route('register') }}" class="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-secondary transition shadow-sm">
                            Initialize Get Started Sequence
                        </a>

                        <a href="{{ route('login') }}" class="rounded-full border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 hover:bg-gray-50 transition shadow-xs">
                            Sign In Profile
                        </a>
                    @endauth
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <div class="grid gap-4">
                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Protected Dashboard Framework</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Session-guarded middleware groups shield all underlying records sheets from structural leakage.</p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Relational Student CRUD Engine</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Create, parse, evaluate, update, or discard complex entities lists using clean automated UI models.</p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-5 border border-gray-100 transition hover:border-primary/20">
                        <h3 class="font-black text-gray-900 tracking-tight">Gender Category Submapping</h3>
                        <p class="mt-1 text-xs font-medium text-gray-400 leading-normal">Maintains reference table relationships via relational foreign keys and constraint hooks.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</body>
</html>