@extends('emails.layout')

@section('title', 'Welcome to DreamPrep')
@section('preheader', 'Your free account is ready. Here is how to get started.')

@section('content')
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;">
        Welcome, {{ \Illuminate\Support\Str::before($user->name, ' ') }}! 🎉
    </h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#475569;">
        Your free DreamPrep account is ready. Here's how to get the most out of it:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5;color:#0f172a;">
        @foreach ([
            ['1', 'Practise every day', 'Answer real exam questions and see why each answer is right.'],
            ['2', 'Take a model test', 'Full exams with a timer and negative marking — just like the real one.'],
            ['3', 'Fix your mistakes', 'Wrong answers come back later so you never repeat them.'],
        ] as [$number, $title, $text])
            <tr>
                <td valign="top" style="padding:0 12px 14px 0;width:28px;">
                    <div style="background:#1b63a8;color:#ffffff;border-radius:50%;width:28px;height:28px;line-height:28px;text-align:center;font-weight:700;font-size:13px;">{{ $number }}</div>
                </td>
                <td valign="top" style="padding-bottom:14px;">
                    <strong>{{ $title }}</strong><br>
                    <span style="color:#64748b;">{{ $text }}</span>
                </td>
            </tr>
        @endforeach
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:10px;">
        <tr>
            <td style="background:#1b63a8;border-radius:999px;">
                <a href="{{ $appUrl }}/app" style="display:inline-block;padding:13px 28px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;">Start practising →</a>
            </td>
        </tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#475569;">
        Tip: try <a href="{{ $appUrl }}/daily" style="color:#1b63a8;font-weight:600;">today's 10-question quiz</a> — it changes every day.
    </p>
@endsection
