<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyPage extends Model
{
    protected $fillable = ['type', 'title_en', 'title_ar', 'description_en', 'description_ar', 'sections'];

    protected $casts = [
        'sections' => 'array', // Automatically cast JSON to array
    ];
}
