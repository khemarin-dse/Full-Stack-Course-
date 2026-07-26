<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The dynamic structural mapping properties allowed for mass assignment arrays.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Data fields targeted for systemic masking routines during data transformation loops.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Enforce type-casting parameters cleanly on target field extractions.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}