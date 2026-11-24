<?php

namespace App\Filament\Resources\Posts\Tables;

use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('')
                    ->disk('public')
                    ->imageHeight(44)
                    ->extraImgAttributes(['class' => 'rounded-lg object-cover aspect-[1.91/1]']),
                TextColumn::make('title')
                    ->searchable(['title', 'excerpt'])
                    ->weight('medium')
                    ->wrap()
                    ->description(fn (Post $record): string => '/blog/'.$record->slug),
                TextColumn::make('category')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Post::CATEGORIES[$state] ?? $state),
                TextColumn::make('views')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime('j M Y')
                    ->color(fn (Post $record): string => $record->published_at?->isFuture() ? 'warning' : 'gray')
                    ->sortable(),
                ToggleColumn::make('is_featured')
                    ->label('Featured'),
                ToggleColumn::make('is_published')
                    ->label('On website'),
            ])
            ->filters([
                SelectFilter::make('category')->options(Post::CATEGORIES),
                TernaryFilter::make('is_published')->label('On website'),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('View on site')
                    ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                    ->color('gray')
                    ->url(fn (Post $record): string => rtrim(config('app.frontend_url'), '/').'/blog/'.$record->slug, shouldOpenInNewTab: true),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No blog posts yet')
            ->emptyStateDescription('Write the first article — guides and tips bring students in from Google.')
            ->emptyStateIcon(Heroicon::OutlinedNewspaper);
    }
}
