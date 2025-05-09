<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTableToAddAddressesJson extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('addresses')->nullable()->after('address'); // Add addresses as JSON
            $table->dropColumn('address'); // Remove the old address column
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('address')->nullable()->after('gender'); // Restore address column
            $table->dropColumn('addresses'); // Remove addresses column
        });
    }
}
