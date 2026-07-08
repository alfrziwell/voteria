<?php

namespace Database\Seeders;

use App\Models\Candidate;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = [
            [
                'candidate_number' => 1,
                'chairman_name' => 'Ahmad Fauzan',
                'vice_chairman_name' => 'Siti Nurhaliza',
                'vision' => 'Mewujudkan kampus yang inovatif, inklusif, dan berdaya saing global melalui pengembangan teknologi dan pemberdayaan mahasiswa.',
                'mission' => "1. Meningkatkan kualitas akademik dan penelitian berbasis teknologi.\n2. Membangun ekosistem kampus yang inklusif dan berkeadilan.\n3. Memperkuat jaringan kerjasama dengan industri dan institusi internasional.\n4. Mengembangkan program kewirausahaan dan kreativitas mahasiswa.",
                'photo_url' => '/storage/candidates/candidate_1.jpg',
            ],
            [
                'candidate_number' => 2,
                'chairman_name' => 'Rizky Pratama',
                'vice_chairman_name' => 'Dewi Anggraini',
                'vision' => 'Membangun kampus berkarakter, berprestasi, dan berintegritas untuk Indonesia yang lebih maju.',
                'mission' => "1. Meningkatkan kesejahteraan dan fasilitas bagi seluruh civitas akademika.\n2. Mendorong prestasi mahasiswa di tingkat nasional dan internasional.\n3. Mewujudkan transparansi dan akuntabilitas dalam organisasi kemahasiswaan.\n4. Membangun budaya literasi dan kepedulian sosial di lingkungan kampus.",
                'photo_url' => '/storage/candidates/candidate_2.jpg',
            ],
        ];

        foreach ($candidates as $candidateData) {
            Candidate::updateOrCreate(
                ['candidate_number' => $candidateData['candidate_number']],
                $candidateData
            );
        }
    }
}
