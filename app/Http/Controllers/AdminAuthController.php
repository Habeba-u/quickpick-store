<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    public function login(Request $request)
{
    try {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only('email', 'password');
        Log::info('Admin login attempt', ['email' => $credentials['email']]);

        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();

            if (!$user->is_admin) {
                Auth::guard('admin')->logout();
                Log::info('Admin login failed: User is not an admin', ['email' => $credentials['email']]);
                return response()->json(['message' => 'You are not authorized to access the admin panel'], 403);
            }

            $token = $user->createToken('admin-token')->plainTextToken; // Generate Sanctum token
            Log::info('Admin login successful', ['user' => $user->toArray()]);
            $request->session()->regenerate();
            return response()->json([
                'user' => $user->only(['id', 'name', 'email', 'is_admin']),
                'token' => $token,
            ], 200);
        }

        Log::info('Admin login failed: Invalid credentials', ['email' => $credentials['email']]);
        return response()->json(['message' => 'Invalid credentials'], 401);
    } catch (\Exception $e) {
        Log::error('Admin login error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json(['message' => 'Server error'], 500);
    }
}

    public function logout(Request $request)
    {
        try {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            Log::error('Admin logout error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
