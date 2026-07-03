<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoterRequest extends FormRequest
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
        return [
            'nim' => ['required', 'string', 'unique:voters,nim'],
            'name' => ['required', 'string', 'max:255'],
            'faculty' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:voters,email'],
            'password' => ['nullable', 'string'],
            'commitment_hash' => ['nullable', 'string'],
        ];
    }
}
