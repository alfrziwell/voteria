<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerklePathResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'leaf' => $this['leaf'],
            'leaf_index' => (int) $this['leaf_index'],
            'path_elements' => $this['path_elements'],
            'path_indices' => array_map('intval', $this['path_indices']),
            'root' => $this['root'],
        ];
    }
}
