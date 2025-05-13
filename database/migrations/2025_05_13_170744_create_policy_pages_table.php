<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolicyPagesTable extends Migration
{
    public function up()
    {
        Schema::create('policy_pages', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // e.g., "Terms", "Privacy", "Cookies"
            $table->string('title_en')->nullable();
            $table->string('title_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->json('sections')->nullable(); // Stores accordion sections as JSON: [{"header_en": "...", "header_ar": "...", "body_en": "...", "body_ar": "..."}, ...]
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('policy_pages');
    }
}
