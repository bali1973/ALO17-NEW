import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  console.log(
    'SMTP_HOST:', process.env.SMTP_HOST,
    'SMTP_PORT:', process.env.SMTP_PORT,
    'SMTP_USER:', process.env.SMTP_USER
  );
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: 'E-posta adresi zorunlu' }, { status: 400 });
  }

  // Ortam değişkenlerini logla
  console.log('SMTP_USER:', process.env.SMTP_USER, 'SMTP_PASS:', process.env.SMTP_PASS);

  // 6 haneli sıfırlama kodu üret
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Alo17 Şifre Sıfırlama Kodu',
    text: `Şifre sıfırlama kodunuz: ${resetCode}\n\nBu kodu şifre sıfırlama ekranında kullanabilirsiniz.\n\nAlo17 Ekibi`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Demo amaçlı kodu frontend'e de döndür
    return NextResponse.json({ message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi.', code: resetCode });
  } catch (error: any) {
    console.error('E-posta gönderilemedi:', error);
    if (error && typeof error === 'object') {
      Object.getOwnPropertyNames(error).forEach(key => {
        console.error(`${key}:`, (error as any)[key]);
      });
    }
    return NextResponse.json({ message: 'E-posta gönderilemedi', detail: error && (error.message || JSON.stringify(error)) }, { status: 500 });
  }
} 