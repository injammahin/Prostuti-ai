<?php

namespace App\Mail;

use App\Models\LoginCode;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code, public string $purpose, public ?string $userName = null) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isReset()
                ? "{$this->code} is your bd3schools password reset code"
                : "{$this->code} is your bd3schools verification code",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.login-code',
            with: [
                'minutes' => LoginCode::LIFETIME_MINUTES,
                'intro' => $this->isReset()
                    ? 'Use this code to set a new password for your bd3schools account.'
                    : 'Use this code to confirm your email and finish creating your free bd3schools account.',
            ],
        );
    }

    private function isReset(): bool
    {
        return $this->purpose === LoginCode::PURPOSE_RESET;
    }
}
