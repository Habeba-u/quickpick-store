<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'code',
        'discount_percentage',
        'expiration_date',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expiration_date' => 'datetime',
    ];
}
