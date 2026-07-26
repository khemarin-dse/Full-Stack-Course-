<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // GenderSeeder must run first to prevent foreign key errors
        $this->call([
            GenderSeeder::class,
            StudentSeeder::class,
        ]);
    }
}