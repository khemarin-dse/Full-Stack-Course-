<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category',
        'limit_amount',
        'month',
    ];

    protected $casts = [
        'limit_amount' => 'decimal:2',
    ];

    protected $appends = ['spent_amount'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Dynamically calculate how much has been spent in this budget's category and month
    public function getSpentAmountAttribute()
    {
        return Transaction::where('user_id', $this->user_id)
            ->where('type', 'expense')
            ->where('category', $this->category)
            ->whereYear('date', substr($this->month, 0, 4))
            ->whereMonth('date', substr($this->month, 5, 2))
            ->sum('amount');
    }
}
