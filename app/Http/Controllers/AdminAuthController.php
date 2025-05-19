<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

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

            // Check if admin exists
            $admin = \App\Models\Admin::where('email', $credentials['email'])->first();
            if (!$admin) {
                Log::info('Admin login failed: Admin not found', ['email' => $credentials['email']]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Verify password
            if (!Hash::check($credentials['password'], $admin->password)) {
                Log::info('Admin login failed: Invalid password', ['email' => $credentials['email']]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Delete any existing tokens
            $admin->tokens()->delete();
            
            // Create new token
            $token = $admin->createToken('admin-token')->plainTextToken;
            
            Log::info('Admin login successful', ['user' => $admin->toArray()]);
            
            return response()->json([
                'user' => $admin->only(['id', 'name', 'email', 'is_admin']),
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Admin login error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            Log::error('Admin logout error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
