<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateRequest extends FormRequest
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
            'candidate_number' => ['required', 'integer', 'unique:candidates,candidate_number'],
            'chairman_name' => ['required', 'string', 'max:255'],
            'vice_chairman_name' => ['required', 'string', 'max:255'],
            'vision' => ['required', 'string'],
            'mission' => ['required', 'string'],
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
        ];
    }
}
