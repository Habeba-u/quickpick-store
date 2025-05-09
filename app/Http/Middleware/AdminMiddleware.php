<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('admin')->check()) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated'], 401)
                : redirect()->route('admin.login');
        }

        $user = Auth::guard('admin')->user();
        if (!$user->is_admin) {
            Auth::guard('admin')->logout();
            return $request->expectsJson()
                ? response()->json(['message' => 'You are not authorized to access the admin panel'], 403)
                : redirect()->route('admin.login')->with('error', 'You are not authorized to access the admin panel');
        }

        return $next($request);
    }
}
