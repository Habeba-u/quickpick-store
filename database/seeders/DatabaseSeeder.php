<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\SettingsSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(
            SettingsSeeder::class
        );
    }
}
