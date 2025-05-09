<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'image', // Featured image
        'gallery_images', // Gallery images
        'category_id',
        'price',
        'stock',
        'description',
        'description_ar',
        'ingredients_material',
        'ingredients_material_ar',
        'instructions',
        'instructions_ar',
        'weight_dimensions',
        'weight_dimensions_ar',
        'return_policy',
        'return_policy_ar',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'price' => 'decimal:2',
        'gallery_images' => 'array', // Cast gallery_images as an array
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
