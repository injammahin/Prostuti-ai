<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AskTutorRequest extends FormRequest
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
            'question_id' => ['required', 'integer', Rule::exists('questions', 'id')->where('status', 'live')],
            'intent' => ['required', Rule::in(['why_others', 'trick', 'simple', 'free'])],
            'message' => ['nullable', 'string', 'max:500', 'required_if:intent,free'],
            'lang' => ['required', Rule::in(['bn', 'en'])],
            'history' => ['nullable', 'array', 'max:8'],
            'history.*.role' => ['required_with:history', Rule::in(['user', 'assistant'])],
            'history.*.text' => ['required_with:history', 'string', 'max:3000'],
        ];
    }
}
