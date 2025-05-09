<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropAddressesTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('addresses');
    }

    public function down()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('type');
            $table->string('apt_no')->nullable();
            $table->string('floor')->nullable();
            $table->string('street');
            $table->string('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }
}
