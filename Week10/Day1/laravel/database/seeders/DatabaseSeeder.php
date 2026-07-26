<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Coordinate system sequence data seeds.
     */
    public function run(): void
    {
        // Enforce execution matrices sequentially to protect relationship keys
        $this->call([
            UserSeeder::class,
            GenderSeeder::class,
            StudentSeeder::class,
        ]);
    }
}