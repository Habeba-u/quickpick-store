<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Sanctum\Sanctum;
use App\Models\Admin;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Allow Sanctum to resolve tokens for Admin model
        Sanctum::authenticateAccessTokensUsing(function ($token, $isValid) {
            Log::info('Sanctum: Attempting to authenticate token', ['token_id' => $token->id, 'tokenable_type' => $token->tokenable_type]);
            if ($token->tokenable_type === Admin::class) {
                $admin = Admin::find($token->tokenable_id);
                if ($admin) {
                    Log::info('Sanctum: Admin user found for token', ['admin_id' => $admin->id]);
                    return $admin;
                } else {
                    Log::warning('Sanctum: Admin user not found for token', ['tokenable_id' => $token->tokenable_id]);
                    return null;
                }
            }
            Log::info('Sanctum: Tokenable type is not Admin');
            return null;
        });
    }
}
