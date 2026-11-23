<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Question
 */
class QuestionResource extends JsonResource
{
    /**
     * Include the correct answer and explanation (never for unanswered practice questions).
     */
    public bool $withAnswer = false;

    public function revealAnswer(bool $reveal = true): static
    {
        $this->withAnswer = $reveal;

        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->whenLoaded('subject', fn (): array => [
                'slug' => $this->subject->slug,
                'name' => $this->subject->name,
            ]),
            'topic' => $this->topic,
            'difficulty' => $this->difficulty,
            'source' => $this->source,
            'lang' => $this->lang,
            'body' => $this->body,
            'options' => $this->options,
            'answer_index' => $this->when($this->withAnswer, $this->answer_index),
            'explanation' => $this->when($this->withAnswer, $this->explanation),
        ];
    }
}
