import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message, type } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isInvestment = type === 'investment';
    const subject = isInvestment
      ? `Investment Enquiry from ${name}${company ? ` — ${company}` : ''}`
      : `Partnership Enquiry from ${name}${company ? ` — ${company}` : ''}`;

    // Notify AureoTrack team
    await resend.emails.send({
      from: 'AureoTrack <contact@aureotrack.com>',
      to: 'contact@aureotrack.com',
      replyTo: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#0d0d0d;font-family:Arial,sans-serif;color:#fff;">
          <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
            <div style="margin-bottom:24px;">
              <span style="background:${isInvestment ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'};color:${isInvestment ? '#f59e0b' : '#10b981'};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">
                ${isInvestment ? '💼 Investment Enquiry' : '🤝 Partnership Enquiry'}
              </span>
            </div>
            <h2 style="color:#fff;margin:0 0 20px;font-size:22px;">New ${isInvestment ? 'Investment' : 'Partnership'} Enquiry</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#9ca3af;width:120px;font-size:13px;">Name</td><td style="color:#fff;font-weight:600;font-size:13px;">${name}</td></tr>
              <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Email</td><td style="font-size:13px;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Company</td><td style="color:#fff;font-size:13px;">${company}</td></tr>` : ''}
              <tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;vertical-align:top;">Message</td><td style="color:#e5e7eb;font-size:13px;line-height:1.6;">${message}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#000;border-radius:12px;border:1px solid rgba(245,158,11,0.2);">
              <p style="color:#9ca3af;margin:0;font-size:12px;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation to sender
    await resend.emails.send({
      from: 'AureoTrack <contact@aureotrack.com>',
      to: email,
      subject: `We received your enquiry — AureoTrack`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#0d0d0d;font-family:Arial,sans-serif;color:#fff;">
          <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
            <div style="text-align:center;margin-bottom:28px;">
              <h1 style="color:#fff;font-size:22px;margin:0 0 8px;">Message Received ✓</h1>
              <p style="color:#9ca3af;margin:0;font-size:14px;">We'll get back to you within 24 hours</p>
            </div>
            <p style="color:#9ca3af;font-size:14px;">Hi ${name},</p>
            <p style="color:#9ca3af;font-size:14px;line-height:1.6;">Thank you for reaching out to AureoTrack regarding ${isInvestment ? 'investment opportunities' : 'a partnership'}. Our team has received your message and will respond within 24 hours.</p>
            <div style="background:#000;border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:20px;margin:24px 0;">
              <p style="color:#f59e0b;font-size:12px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Your Message</p>
              <p style="color:#e5e7eb;font-size:13px;margin:0;line-height:1.6;">${message}</p>
            </div>
            <p style="color:#6b7280;font-size:12px;">Questions? Reply to this email or visit <a href="https://aureotrack.com" style="color:#f59e0b;">aureotrack.com</a></p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}