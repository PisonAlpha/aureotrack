import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateVerificationCode } from '@/lib/email';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success even if email not found (security best practice)
    if (!user) {
      return NextResponse.json({ success: true, message: 'If this email exists, a reset code has been sent.' });
    }

    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from('users')
      .update({ reset_code: code, reset_code_expires_at: expires })
      .eq('id', user.id);

    const resend = getResend();
    await resend.emails.send({
      from: 'AureoTrack <contact@aureotrack.com>',
      to: user.email,
      subject: 'Reset your AureoTrack password',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
                  <tr>
                    <td style="background-color:#000000;padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.1);">
                      <span style="font-size:18px;font-weight:700;color:#ffffff;">AureoTrack</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px 32px;">
                      <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px 0;">Reset your password</h1>
                      <p style="color:#9ca3af;font-size:15px;margin:0 0 32px 0;">Hi ${user.full_name}, use the code below to reset your password.</p>
                      <div style="background-color:#000000;border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:32px;text-align:center;margin:0 0 32px 0;">
                        <p style="color:#9ca3af;font-size:13px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:2px;">Password reset code</p>
                        <p style="color:#f59e0b;font-size:40px;font-weight:700;letter-spacing:12px;margin:0;font-family:monospace;">${code}</p>
                        <p style="color:#6b7280;font-size:12px;margin:16px 0 0 0;">Expires in 15 minutes</p>
                      </div>
                      <p style="color:#6b7280;font-size:13px;margin:0 0 8px 0;">If you didn't request a password reset, you can safely ignore this email.</p>
                      <p style="color:#6b7280;font-size:13px;margin:0;">Never share this code with anyone.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);">
                      <p style="color:#4b5563;font-size:12px;margin:0;">© 2026 AureoTrack. Macro & Trading Intelligence.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'If this email exists, a reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send reset code' }, { status: 500 });
  }
}