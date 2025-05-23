<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function adminIndex()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        Log::info('CategoryController@store: Start of method.');
        Log::info('CategoryController@store: Request received.');
        Log::info('CategoryController@store: Authenticated user', ['user' => $request->user()]);

        // Check if the authenticated user is an admin
        if (!$request->user() || !$request->user()->is_admin) {
            Log::warning('CategoryController@store: Unauthorized access attempt.', ['user' => $request->user()]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();
    if (isset($data['visibility'])) {
        $data['visibility'] = filter_var($data['visibility'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($data['visibility'] === null) {
            return response()->json(['message' => 'The visibility field must be true or false.'], 422);
        }
    }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'visibility' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image file
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        }

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'visibility' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image file
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        } else {
            // Keep existing image if no new file is uploaded
            $validated['image'] = $category->image;
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
