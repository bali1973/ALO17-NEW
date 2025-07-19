import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { to, code } = await req.json();

  if (!to || !code) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
  }

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
    to,
    subject: 'Alo17 E-posta Doğrulama Kodu',
    text: `Doğrulama kodunuz: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'E-posta gönderilemedi', detail: error && (error.message || JSON.stringify(error)) }, { status: 500 });
  }
} 