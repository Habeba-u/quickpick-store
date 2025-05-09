<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Orange Juice - Freshly Squeezed',
                'name_ar' => 'عصير برتقال طازج',
                'category' => 'Beverages',
                'price' => 45.00,
                'image' => '/assets/products/orange-juice.jpg',
            ],
            [
                'name' => 'Whole Grain Bread',
                'name_ar' => 'خبز الحبوب الكاملة',
                'category' => 'Bakery',
                'price' => 30.00,
                'image' => '/assets/products/whole-grain-bread.jpg',
            ],
            [
                'name' => 'Fresh Apples',
                'name_ar' => 'تفاح طازج',
                'category' => 'Fruits',
                'price' => 20.00,
                'image' => '/assets/products/apples.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
