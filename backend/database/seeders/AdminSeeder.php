<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Rektor Universitas',
                'username' => 'rektor',
                'password' => Hash::make('rektor123'),
                'role' => 'rektor',
            ],
            [
                'name' => 'Dekan Fakultas 1',
                'username' => 'dekan1',
                'password' => Hash::make('dekan1123'),
                'role' => 'dekan_1',
            ],
            [
                'name' => 'Dekan Fakultas 2',
                'username' => 'dekan2',
                'password' => Hash::make('dekan2123'),
                'role' => 'dekan_2',
            ],
            [
                'name' => 'Ketua KPUM',
                'username' => 'kpum',
                'password' => Hash::make('kpum123'),
                'role' => 'kpum',
            ],
        ];

        foreach ($admins as $adminData) {
            Admin::updateOrCreate(
                ['username' => $adminData['username']],
                $adminData
            );
        }
    }
}
