<?php

namespace App\Services;

use DateTimeInterface;

class Bangla
{
    private const DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    private const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

    public static function digits(int|string|null $value): string
    {
        return strtr((string) $value, self::DIGITS);
    }

    /**
     * 10 → "১০ম", 47 → "৪৭তম".
     */
    public static function ordinal(int $number): string
    {
        return self::digits($number).($number === 10 ? 'ম' : 'তম');
    }

    /**
     * 2025-07-18 → "১৮ জুলাই ২০২৫".
     */
    public static function date(DateTimeInterface $date): string
    {
        return self::digits($date->format('j')).' '.self::MONTHS[(int) $date->format('n') - 1].' '.self::digits($date->format('Y'));
    }
}
