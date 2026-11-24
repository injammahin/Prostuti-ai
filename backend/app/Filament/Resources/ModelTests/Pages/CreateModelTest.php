<?php

namespace App\Filament\Resources\ModelTests\Pages;

use App\Filament\Resources\ModelTests\ModelTestResource;
use App\Services\ModelTestGeneratorService;
use Filament\Resources\Pages\CreateRecord;

class CreateModelTest extends CreateRecord
{
    protected static string $resource = ModelTestResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (empty($data['questions_data'])) {
            $data['questions_data'] = ModelTestGeneratorService::generateBcsQuestions();
            $data['total_questions'] = count($data['questions_data']);
            $data['syllabus'] = ModelTestGeneratorService::BCS_SYLLABUS;
        }

        return $data;
    }
}
