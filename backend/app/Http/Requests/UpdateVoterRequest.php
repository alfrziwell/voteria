<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVoterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $voterId = $this->route('voter');

        return [
            'nim' => ['sometimes', 'string', 'unique:voters,nim,' . $voterId],
            'name' => ['sometimes', 'string', 'max:255'],
            'faculty' => ['sometimes', 'string', 'max:255'],
            'password' => ['sometimes', 'string', 'min:6'],
            'commitment_hash' => ['sometimes', 'nullable', 'string'],
            'has_voted' => ['sometimes', 'boolean'],
        ];
    }
}
