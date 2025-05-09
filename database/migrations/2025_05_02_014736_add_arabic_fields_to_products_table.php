<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddArabicFieldsToProductsTable extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('description_ar')->nullable()->after('description');
            $table->text('ingredients_material_ar')->nullable()->after('ingredients_material');
            $table->text('instructions_ar')->nullable()->after('instructions');
            $table->text('weight_dimensions_ar')->nullable()->after('weight_dimensions');
            $table->text('return_policy_ar')->nullable()->after('return_policy');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'description_ar',
                'ingredients_material_ar',
                'instructions_ar',
                'weight_dimensions_ar',
                'return_policy_ar',
            ]);
        });
    }
}
