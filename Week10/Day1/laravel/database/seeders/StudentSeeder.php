<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $maleId = Gender::where('name', 'Male')->value('id');
        $femaleId = Gender::where('name', 'Female')->value('id');

        $students = [
            [
                'name' => 'Sok Dara',
                'email' => 'sok.dara@rupp.edu.kh',
                'phone' => '010 123 123',
                'gender_id' => $maleId,
            ],
            [
                'name' => 'Chan Pisey',
                'email' => 'chan.pisey@rupp.edu.kh',
                'phone' => '011 456 456',
                'gender_id' => $femaleId,
            ],
            [
                'name' => 'Kim Vanna',
                'email' => 'kim.vanna@rupp.edu.kh',
                'phone' => '012 777 888',
                'gender_id' => $maleId,
            ],
            [
                'name' => 'Sros Bopha',
                'email' => 'sros.bopha@rupp.edu.kh',
                'phone' => '015 222 333',
                'gender_id' => $femaleId,
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['email' => $student['email']],
                $student
            );
        }
    }
}