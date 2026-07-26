<?php

namespace App\Services;

class Data
{
    public static array $students = [
        [
            'id' => 1,
            'name' => 'Sok Dara',
            'gender' => 'Male',
            'email' => 'sok.dara@rupp.edu.kh',
            'phone' => '010 123 123',
            'class' => 'Laravel A',
            'status' => 'Active',
        ],
        [
            'id' => 2,
            'name' => 'Sok Pisey',
            'gender' => 'Female',
            'email' => 'sok.pisey@rupp.edu.kh',
            'phone' => '011 123 123',
            'class' => 'Laravel A',
            'status' => 'Active',
        ],
        [
            'id' => 3,
            'name' => 'Sros Bopha',
            'gender' => 'Female',
            'email' => 'sros.bopha@rupp.edu.kh',
            'phone' => '090 909 123',
            'class' => 'Laravel B',
            'status' => 'Pending',
        ],
        [
            'id' => 4,
            'name' => 'Tith Sovan',
            'gender' => 'Male',
            'email' => 'tith.sovan@rupp.edu.kh',
            'phone' => '090 902 283',
            'class' => 'Laravel B',
            'status' => 'Inactive',
        ],
        [
            'id' => 5,
            'name' => 'Chan Leakhena',
            'gender' => 'Female',
            'email' => 'chan.leakhena@rupp.edu.kh',
            'phone' => '090 233 322',
            'class' => 'Laravel C',
            'status' => 'Active',
        ],
    ];

    public static array $genders = [
        ['id' => 1, 'name' => 'Male'],
        ['id' => 2, 'name' => 'Female'],
    ];

    public static function students(): array
    {
        return self::$students;
    }

    public static function genders(): array
    {
        return self::$genders;
    }

    public static function findStudent(int $id): ?array
    {
        return collect(self::$students)->firstWhere('id', $id);
    }
}