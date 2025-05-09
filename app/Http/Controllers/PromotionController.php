<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:promotions,code',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'expiration_date' => 'required|date|after:now',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:promotions,code,' . $id,
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'expiration_date' => 'required|date|after:now',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion->update($request->all());
        return response()->json($promotion);
    }

    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();
        return response()->json(['message' => 'Promotion deleted']);
    }

    // Public endpoint to validate a promo code
    public function validatePromoCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $code = $request->input('code');
        $promotion = Promotion::where('code', $code)
            ->where('is_active', true)
            ->where('expiration_date', '>', now())
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Invalid or expired promo code'], 404);
        }

        return response()->json([
            'discount_percentage' => $promotion->discount_percentage,
        ]);
    }
}
