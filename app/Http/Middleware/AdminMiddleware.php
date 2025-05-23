<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('AdminMiddleware: Checking user authentication and admin status');
        $user = $request->user();

        if (!$user) {
            Log::warning('AdminMiddleware: User is null (Unauthenticated)');
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated'], 401)
                : redirect()->route('admin.login');
        }

        Log::info('AdminMiddleware: User found', ['user_id' => $user->id, 'is_admin' => $user->is_admin]);

        if (!$user->is_admin) {
            Log::warning('AdminMiddleware: User is not an admin');
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated'], 401) // Or 403 Forbidden if you prefer
                : redirect()->route('admin.login'); // Or a different forbidden page
        }

        Log::info('AdminMiddleware: User is authenticated and is admin. Proceeding.');
        return $next($request);
    }
}
