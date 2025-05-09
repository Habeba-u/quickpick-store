<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'gender',
        'password',
        'wallet',
        'cards',
        'image',
        'is_admin',
        'addresses', // Add addresses to fillable
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'addresses' => 'array', // Cast addresses as an array
        'cards' => 'array',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
