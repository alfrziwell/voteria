<!DOCTYPE html>
<html>
<head>
    <title>Kredensial Akun Voteria</title>
</head>
<body style="font-family: sans-serif; background-color: #eeeeee; padding: 20px; color: #080627; margin: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border: 2px solid #080627; box-shadow: 4px 4px 0px 0px rgba(8,6,39,1);">
        <h2 style="font-family: 'Poppins', sans-serif; border-bottom: 2px solid #734CA8; padding-bottom: 10px; text-transform: uppercase; font-weight: 900; tracking-wide: 1px;">Kredensial Akun Pemilih</h2>
        <p style="font-size: 14px; line-height: 1.6;">Halo <strong>{{ $name }}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">Akun Anda untuk sistem E-Voting Voteria telah didaftarkan oleh Administrator. Berikut adalah data akun Anda untuk masuk:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; border: 2px solid #080627;">
            <tr style="background-color: #eeeeee;">
                <td style="padding: 12px; font-weight: bold; width: 30%; border-right: 2px solid #080627; border-bottom: 2px solid #080627; font-size: 12px; text-transform: uppercase;">NIM</td>
                <td style="padding: 12px; font-family: monospace; font-size: 14px; font-weight: bold; border-bottom: 2px solid #080627;">{{ $nim }}</td>
            </tr>
            <tr>
                <td style="padding: 12px; font-weight: bold; border-right: 2px solid #080627; font-size: 12px; text-transform: uppercase;">Kata Sandi</td>
                <td style="padding: 12px; font-family: monospace; font-size: 14px; font-weight: bold; color: #734CA8;">{{ $password }}</td>
            </tr>
        </table>
        
        <p style="font-size: 11px; color: #666666; line-height: 1.5; border-left: 3px solid #734CA8; padding-left: 10px; margin-bottom: 30px;">
            *Harap simpan kredensial ini secara rahasia dan jangan bagikan kepada siapapun. Pilihan kandidat Anda nantinya dienkripsi penuh menggunakan Zero-Knowledge Proof (ZKP) sehingga tidak dapat dikaitkan dengan identitas Anda oleh siapapun.
        </p>
        
        <div style="text-align: center; margin-bottom: 10px;">
            <a href="http://localhost:5173/login" style="background-color: #734CA8; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: 2px solid #080627; display: inline-block; font-size: 12px; letter-spacing: 1px; box-shadow: 3px 3px 0px 0px rgba(8,6,39,1);">Mulai Memilih</a>
        </div>
    </div>
</body>
</html>
