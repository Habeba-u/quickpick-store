<?php

namespace App\Http\Controllers;

use App\Models\PolicyPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PolicyPagesController extends Controller
{
    public function index()
    {
        $policies = PolicyPage::all();
        return response()->json($policies);
    }

    public function show($type)
    {
        $policy = PolicyPage::where('type', $type)->first();
        if (!$policy) {
            return response()->json(['message' => 'Policy not found'], 404);
        }
        return response()->json($policy);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        // Ensure sections is an array
        $sections = [];
        foreach ($data as $index => $item) {
            if (isset($item['header_en'], $item['header_ar'], $item['body_en'], $item['body_ar'])) {
                $sections[] = [
                    'header_en' => $item['header_en'],
                    'header_ar' => $item['header_ar'],
                    'body_en' => $item['body_en'],
                    'body_ar' => $item['body_ar'],
                ];
            }
        }

        $policyData = [
            'type' => $data[0]['type'] ?? '',
            'title_en' => $data[0]['title_en'] ?? '',
            'title_ar' => $data[0]['title_ar'] ?? '',
            'description_en' => $data[0]['description_en'] ?? '',
            'description_ar' => $data[0]['description_ar'] ?? '',
            'sections' => $sections,
        ];

        // Update or create the policy page
        $policy = PolicyPage::updateOrCreate(
            ['type' => $policyData['type']],
            $policyData
        );

        return response()->json(['message' => 'Policy updated successfully', 'policy' => $policy], 200);
    }
}
