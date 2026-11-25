<?php

namespace App\Services;

use App\Models\Notice;
use Illuminate\Support\Facades\Storage;

/**
 * The picture shown when a page is shared. Those of lasting pages are files of the website build (/og/…);
 * a notice gets its own in the admin panel, right after it is saved (see public/js/share-images.js).
 */
class ShareImage
{
    /** Pages without a picture of their own use their section's. */
    private const SECTIONS = ['bcs', 'notices', 'blog', 'ntrca', 'primary-teacher', 'bank-jobs', 'questions'];

    public static function forPath(string $path): ?string
    {
        $shell = PageShell::path();

        if ($shell === null) {
            return null;
        }

        $name = str(strtok($path, '?') ?: '')->trim('/')->replace('/', '-')->toString() ?: 'home';

        foreach ([$name, in_array($section = explode('/', trim($path, '/'))[0], self::SECTIONS, true) ? $section : 'home'] as $candidate) {
            if (preg_match('/^[a-z0-9-]+$/', $candidate) && is_file(dirname($shell)."/og/{$candidate}.png")) {
                return "/og/{$candidate}.png";
            }
        }

        return null;
    }

    public static function forNotice(Notice $notice): ?string
    {
        $file = self::noticeFile($notice);

        return Storage::disk('public')->exists($file) ? '/storage/'.$file : null;
    }

    /**
     * Named after the title, so a changed title gets a new picture.
     */
    public static function noticeFile(Notice $notice): string
    {
        return "og/notices/{$notice->id}-".substr(md5($notice->title.'|'.$notice->title_bn), 0, 10).'.png';
    }
}
