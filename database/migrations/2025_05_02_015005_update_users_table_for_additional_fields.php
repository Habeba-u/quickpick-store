<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class UpdateUsersTableForAdditionalFields extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Step 1: Add first_name and last_name as nullable
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
        });

        // Step 2: Populate first_name and last_name by splitting the name column
        $users = User::all();
        foreach ($users as $user) {
            $nameParts = explode(' ', $user->name, 2);
            $user->first_name = $nameParts[0];
            $user->last_name = isset($nameParts[1]) ? $nameParts[1] : '';
            $user->save();
        }

        Schema::table('users', function (Blueprint $table) {
            // Step 3: Drop the name column
            $table->dropColumn('name');

            // Step 4: Add NOT NULL constraint to first_name and last_name
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();

            // Step 5: Add the remaining columns
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('email');

            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('gender');
            }

            $table->decimal('wallet', 10, 2)->default(0.00)->after('address');
            $table->json('cards')->nullable()->after('wallet');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Re-add the name column
            $table->string('name')->after('id');

            // Populate name by concatenating first_name and last_name
            $users = User::all();
            foreach ($users as $user) {
                $user->name = trim("{$user->first_name} {$user->last_name}");
                $user->save();
            }

            // Drop the added columns
            $table->dropColumn([
                'first_name',
                'last_name',
                'gender',
                'wallet',
                'cards',
            ]);

            // Only drop 'phone' and 'address' if they were added in this migration
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('users', 'address')) {
                $table->dropColumn('address');
            }
        });
    }
}
