<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>@yield('title', 'bd3schools')</title>
</head>
<body style="margin:0;padding:0;background:#f1f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">@yield('preheader')</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5fb;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
                    {{-- Brand --}}
                    <tr>
                        <td style="padding:0 4px 18px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width:40px;height:40px;"><img src="{{ asset('logo-mark.png') }}" width="40" height="40" alt="bd3schools" style="display:block;border:0;border-radius:10px;"></td>
                                    <td style="padding-left:10px;">
                                        <div style="font-size:20px;font-weight:800;color:#0f172a;line-height:1;letter-spacing:-0.02em;">bd3<span style="color:#1d6ca8;">schools</span></div>
                                        <div style="font-size:12px;color:#64748b;padding-top:3px;">বিসিএস ও সরকারি চাকরি একাডেমি</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background:#ffffff;border-radius:20px;padding:32px 28px;border:1px solid #e2e8f0;">
                            @yield('content')
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="padding:20px 8px 0;text-align:center;font-size:12px;line-height:1.6;color:#94a3b8;">
                            bd3schools — free exam preparation for BCS, Bank, NTRCA &amp; Primary exams.<br>
                            You're receiving this because someone used this email on bd3schools.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
