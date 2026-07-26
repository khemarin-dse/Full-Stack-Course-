<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'target_amount',
        'saved_amount',
        'deadline',
        'note',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'saved_amount'  => 'decimal:2',
        'deadline'      => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function histories()
    {
        return $this->hasMany(GoalHistory::class)->orderByDesc('date');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
