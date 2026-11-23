@extends('emails.layout')

@section('title', 'Your Prostuti code')
@section('preheader', "Your Prostuti code is {$code}. It works for {$minutes} minutes.")

@section('content')
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;">
        {{ $userName ? 'Hi '.\Illuminate\Support\Str::before($userName, ' ').',' : 'Hi there,' }}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
        {{ $intro }}
    </p>

    <div style="background:#eef4fb;border-radius:16px;padding:22px 12px;text-align:center;">
        <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1b63a8;font-family:'SFMono-Regular',Consolas,monospace;">{{ $code }}</div>
        <div style="margin-top:6px;font-size:13px;color:#64748b;">This code works for {{ $minutes }} minutes.</div>
    </div>

    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;">
        Didn't ask for this? You can safely ignore this email — nothing will change without this code.
    </p>
@endsection
