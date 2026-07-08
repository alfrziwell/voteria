<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $blockchainService = new \App\Services\BlockchainService();
        $votes = $blockchainService->getCandidateVotes($this->id);

        return [
            'id' => $this->id,
            'candidate_number' => (int) $this->candidate_number,
            'chairman_name' => $this->chairman_name,
            'vice_chairman_name' => $this->vice_chairman_name,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'photo_url' => $this->photo_url,
            'votes' => $votes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
