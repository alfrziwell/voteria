<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MerkleLeaf extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'merkle_leaves';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'leaf_index',
        'leaf_hash',
    ];

    /**
     * Get the leaf index cast to integer.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'leaf_index' => 'integer',
        ];
    }
}
