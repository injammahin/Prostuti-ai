<?php

namespace App\Filament\Resources\DailyQuizAttempts\Tables;

use App\Models\DailyQuizAttempt;
use App\Models\PageView;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DailyQuizAttemptsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->poll('15s')
            ->modifyQueryUsing(fn (Builder $query): Builder => $query
                ->with('user')
                ->select('daily_quiz_attempts.*')
                ->selectSub(
                    DB::table('daily_quiz_attempts as same_visitor')
                        ->selectRaw('count(*)')
                        ->whereColumn('same_visitor.visitor_id', 'daily_quiz_attempts.visitor_id'),
                    'visitor_attempts',
                ))
            ->groups([
                Group::make('slot')
                    ->label('Round')
                    ->getTitleFromRecordUsing(fn (DailyQuizAttempt $record): string => DailyQuizAttempt::slotLabel($record->slot))
                    ->orderQueryUsing(fn (Builder $query, string $direction): Builder => $query->orderBy('slot', 'desc')),
            ])
            ->columns([
                TextColumn::make('created_at')
                    ->label('When')
                    ->dateTime('j M, g:i a', config('app.student_timezone'))
                    ->description(fn (DailyQuizAttempt $record): string => $record->created_at->diffForHumans())
                    ->sortable(),
                TextColumn::make('who')
                    ->label('Who')
                    ->getStateUsing(fn (DailyQuizAttempt $record): string => $record->user?->name ?? 'Guest')
                    ->weight(fn (DailyQuizAttempt $record): ?string => $record->user ? 'semibold' : null)
                    ->color(fn (DailyQuizAttempt $record): ?string => $record->user ? null : 'gray')
                    ->description(fn (DailyQuizAttempt $record): string => $record->user?->email
                        ?? ($record->visitor_id ? 'Visitor '.substr($record->visitor_id, 0, 8).self::repeatNote((int) $record->visitor_attempts) : 'Unknown visitor'))
                    ->searchable(query: fn (Builder $query, string $search): Builder => $query->where(fn (Builder $q) => $q
                        ->where('visitor_id', 'like', "{$search}%")
                        ->orWhereHas('user', fn (Builder $user) => $user->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))),
                TextColumn::make('score')
                    ->label('Score')
                    ->badge()
                    ->formatStateUsing(fn (DailyQuizAttempt $record): string => "{$record->score}/{$record->total}")
                    ->description(fn (DailyQuizAttempt $record): string => $record->percent().'%')
                    ->color(fn (DailyQuizAttempt $record): string => match (true) {
                        $record->percent() >= 80 => 'success',
                        $record->percent() >= 50 => 'warning',
                        default => 'danger',
                    })
                    ->sortable(),
                TextColumn::make('seconds')
                    ->label('Time taken')
                    ->formatStateUsing(fn (?int $state): string => $state === null ? '—' : sprintf('%d:%02d min', intdiv($state, 60), $state % 60))
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('source')
                    ->label('Came from')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => DailyQuizAttempt::sourceLabel($state))
                    ->color(fn (?string $state): string => DailyQuizAttempt::sourceColor($state))
                    ->description(fn (DailyQuizAttempt $record): ?string => $record->referrer)
                    ->placeholder('Unknown'),
                TextColumn::make('slot')
                    ->label('Round')
                    ->formatStateUsing(fn (?string $state): string => DailyQuizAttempt::slotLabel($state))
                    ->toggleable(),
                TextColumn::make('device')
                    ->formatStateUsing(fn (?string $state): string => PageView::DEVICES[$state] ?? '—')
                    ->description(fn (DailyQuizAttempt $record): ?string => $record->browser)
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('ip')
                    ->label('IP address')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('user_id')
                    ->label('Who')
                    ->nullable()
                    ->trueLabel('Students only')
                    ->falseLabel('Guests only'),
                SelectFilter::make('source')
                    ->label('Came from')
                    ->multiple()
                    ->options(collect(DailyQuizAttempt::SOURCES)->map(fn (array $source): string => $source[0])->all()),
                SelectFilter::make('slot')
                    ->label('Round')
                    ->options(fn (): array => DailyQuizAttempt::query()
                        ->distinct()
                        ->orderByDesc('slot')
                        ->limit(30)
                        ->pluck('slot')
                        ->mapWithKeys(fn (string $slot): array => [$slot => DailyQuizAttempt::slotLabel($slot)])
                        ->all()),
                SelectFilter::make('result')
                    ->label('Score')
                    ->options(['perfect' => 'Perfect score', 'pass' => '50% or more', 'low' => 'Below 50%'])
                    ->query(fn (Builder $query, array $data): Builder => match ($data['value'] ?? null) {
                        'perfect' => $query->whereColumn('score', 'total'),
                        'pass' => $query->whereRaw('score * 2 >= total'),
                        'low' => $query->whereRaw('score * 2 < total'),
                        default => $query,
                    }),
                Filter::make('date')
                    ->schema([
                        DatePicker::make('from'),
                        DatePicker::make('until'),
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query
                        ->when($data['from'] ?? null, fn (Builder $q, string $date) => $q->whereDate('daily_quiz_attempts.created_at', '>=', $date))
                        ->when($data['until'] ?? null, fn (Builder $q, string $date) => $q->whereDate('daily_quiz_attempts.created_at', '<=', $date))),
            ]);
    }

    /**
     * " · 3rd quiz" style note so returning guests stand out.
     */
    private static function repeatNote(int $attempts): string
    {
        return $attempts > 1 ? " · {$attempts} quizzes in total" : '';
    }
}
