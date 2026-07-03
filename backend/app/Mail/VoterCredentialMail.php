<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VoterCredentialMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $nim;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $nim, $password)
    {
        $this->name = $name;
        $this->nim = $nim;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Voteria E-Voting - Kredensial Akun Pemilih',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.voter_credentials',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
