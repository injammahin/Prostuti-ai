<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
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
            'target' => ['required', Rule::in(array_keys(Report::TARGETS))],
            'target_ref' => ['required', 'string', 'max:150'],
            'reason' => ['required', 'string', 'max:60'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
