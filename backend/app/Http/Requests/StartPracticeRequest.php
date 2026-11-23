<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StartPracticeRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'mode' => ['required', Rule::in(['drill', 'past', 'mistakes', 'diagnostic'])],
            'exam' => ['nullable', 'string', Rule::exists('exams', 'slug')],
            'subject' => ['nullable', 'string', Rule::exists('subjects', 'slug')],
            'count' => ['nullable', 'integer', 'min:5', 'max:100'],
        ];
    }
}
