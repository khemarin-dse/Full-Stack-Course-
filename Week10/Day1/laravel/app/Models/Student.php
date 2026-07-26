<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'gender_id',
    ];

    /**
     * Deconstruct foreign constraint dependencies into clean entity relationships.
     */
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class);
    }
}