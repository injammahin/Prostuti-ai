<?php

namespace App\Filament\Resources\Notices\Tables;

use App\Filament\Resources\Notices\NoticeResource;
use App\Models\Notice;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class NoticesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('published_on', 'desc')
            ->modifyQueryUsing(fn ($query) => $query->with('exam'))
            ->columns([
                TextColumn::make('title')
                    ->searchable(['title', 'title_bn', 'org'])
                    ->weight('medium')
                    ->wrap()
                    ->description(fn (Notice $record): string => $record->org.($record->exam ? ' · '.$record->exam->name : '')),
                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Notice::TYPES[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        'circular', 'schedule' => 'primary',
                        'deadline', 'syllabus' => 'warning',
                        'result' => 'success',
                        default => 'info',
                    }),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn (Notice $record): ?string => $record->currentStatus())
                    ->formatStateUsing(fn (?string $state): string => Notice::STATUSES[$state][0] ?? '—')
                    ->color(fn (?string $state): string => match ($state) {
                        'open' => 'success',
                        'closing' => 'warning',
                        'closed' => 'gray',
                        default => 'info',
                    }),
                TextColumn::make('apply_until')
                    ->label('Deadline')
                    ->date('j M Y')
                    ->placeholder('—')
                    ->color(fn (Notice $record): string => $record->apply_until?->between(today(), today()->addDays(3)) ? 'danger' : 'gray')
                    ->sortable(),
                TextColumn::make('exam_date')
                    ->label('Exam date')
                    ->date('j M Y')
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('published_on')
                    ->label('Published')
                    ->date('j M Y')
                    ->sortable(),
                ToggleColumn::make('is_published')
                    ->label('Published'),
            ])
            ->filters([
                SelectFilter::make('type')->options(Notice::TYPES),
                SelectFilter::make('exam')->relationship('exam', 'name')->preload(),
                TernaryFilter::make('is_published')->label('Published')->trueLabel('Published')->falseLabel('Drafts'),
                SelectFilter::make('category')->label('Section')->options(array_map(fn (array $names): string => $names[0], Notice::CATEGORIES)),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('View on site')
                    ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                    ->color('gray')
                    ->visible(fn (Notice $record): bool => $record->is_published)
                    ->url(fn (Notice $record): string => rtrim(config('app.frontend_url'), '/').'/notices/'.$record->slug, shouldOpenInNewTab: true),
                NoticeResource::previewAction()->hidden(fn (Notice $record): bool => $record->is_published),
                Action::make('update')
                    ->label('Update')
                    ->icon(Heroicon::OutlinedArrowPath)
                    ->color('warning')
                    ->modalHeading(fn (Notice $record): string => "Update: {$record->title}")
                    ->modalDescription('The same page is updated and the change is shown to students.')
                    ->fillForm(fn (Notice $record): array => $record->only(['type', 'status', 'apply_until', 'exam_date', 'url', 'summary', 'summary_bn']))
                    ->schema([
                        Select::make('type')->options(Notice::TYPES)->required()->native(false),
                        Select::make('status')->options(array_map(fn (array $names): string => $names[0], Notice::STATUSES))->placeholder('From the type and dates')->native(false),
                        DatePicker::make('apply_until')->label('Application deadline')->native(false),
                        DatePicker::make('exam_date')->label('Exam date')->native(false),
                        TextInput::make('url')->label('Official link')->url()->maxLength(255),
                        Textarea::make('summary')->label('Summary (English)')->rows(3)->required(),
                        Textarea::make('summary_bn')->label('Summary (বাংলা)')->rows(3),
                    ])
                    ->action(fn (Notice $record, array $data) => $record->applyUpdate($data)),
                EditAction::make(),
                NoticeResource::duplicateAction(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No notices yet')
            ->emptyStateDescription('Add the first job circular, exam date or result.')
            ->emptyStateIcon(Heroicon::OutlinedMegaphone);
    }
}
