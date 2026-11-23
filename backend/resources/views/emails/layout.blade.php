<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>@yield('title', 'Prostuti')</title>
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
                                    <td style="background:#1b63a8;border-radius:10px;width:36px;height:36px;text-align:center;color:#ffffff;font-weight:800;font-size:18px;">P</td>
                                    <td style="padding-left:10px;">
                                        <div style="font-size:20px;font-weight:800;color:#1b63a8;line-height:1;">Prostuti</div>
                                        <div style="font-size:12px;color:#64748b;">প্রস্তুতি</div>
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
                            Prostuti — free exam preparation for BCS, Bank, NTRCA &amp; Primary exams.<br>
                            You're receiving this because someone used this email on Prostuti.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
