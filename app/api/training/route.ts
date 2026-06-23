import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, experience, goals, programId, programTitle, programPrice } = await request.json();

    if (!name || !email || !programId) {
      return NextResponse.json({ error: 'Name, email and program are required' }, { status: 400 });
    }

    const { data: enrollment, error } = await supabaseAdmin
      .from('training_enrollments')
      .insert({
        full_name: name,
        email: email.toLowerCase(),
        phone: phone || null,
        experience: experience || null,
        goals: goals || null,
        program_id: programId,
        program_title: programTitle,
        program_price: programPrice,
        status: 'pending',
        paid: false,
      })
      .select()
      .single();

    if (error) throw error;

    const resend = getResend();

    // Send notification to AureoTrack admin
    await resend.emails.send({
      from: 'AureoTrack <contact@aureotrack.com>',
      to: 'contact@aureotrack.com',
      subject: `New Training Enrollment — ${programTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#0d0d0d;font-family:sans-serif;color:#fff;">
          <div style="max-width:560px;margin:0 auto;background:#111;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
            <h2 style="color:#f59e0b;margin:0 0 20px;">New Training Enrollment</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#9ca3af;width:140px;">Program</td><td style="color:#fff;font-weight:600;">${programTitle}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Price</td><td style="color:#f59e0b;font-weight:600;">${programPrice}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Name</td><td style="color:#fff;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Email</td><td style="color:#fff;">${email}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Phone</td><td style="color:#fff;">${phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Experience</td><td style="color:#fff;">${experience || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Goals</td><td style="color:#fff;">${goals || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Enrollment ID</td><td style="color:#6b7280;font-size:12px;">${enrollment.id}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#000;border-radius:8px;border:1px solid rgba(245,158,11,0.2);">
              <p style="color:#9ca3af;margin:0;font-size:13px;">To mark this enrollment as paid, go to your <a href="https://aureotrack.com/admin/training" style="color:#f59e0b;">Admin Dashboard</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation to student
    await resend.emails.send({
      from: 'AureoTrack <contact@aureotrack.com>',
      to: email,
      subject: `Enrollment Confirmed — ${programTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#0d0d0d;font-family:sans-serif;color:#fff;">
          <div style="max-width:560px;margin:0 auto;background:#111;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#fff;font-size:24px;margin:0 0 8px;">Enrollment Confirmed! 🎉</h1>
              <p style="color:#9ca3af;margin:0;">Thank you for enrolling in AureoTrack Training</p>
            </div>
            <div style="background:#000;border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Program Enrolled</p>
              <p style="color:#f59e0b;font-size:20px;font-weight:700;margin:0 0 4px;">${programTitle}</p>
              <p style="color:#fff;font-size:24px;font-weight:700;margin:0;">${programPrice}</p>
            </div>
            <p style="color:#9ca3af;font-size:14px;">Hi ${name},</p>
            <p style="color:#9ca3af;font-size:14px;">Your enrollment has been received. Our team will contact you within 24 hours with payment instructions and next steps.</p>
            <div style="margin:24px 0;padding:16px;background:#1a1a1a;border-radius:8px;">
              <p style="color:#fff;font-size:13px;font-weight:600;margin:0 0 12px;">What happens next:</p>
              <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">→ You'll receive payment instructions within 24 hours</p>
              <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">→ Once payment is confirmed, you'll get access to the private group</p>
              <p style="color:#9ca3af;font-size:13px;margin:0;">→ Your first live session details will be shared via email</p>
            </div>
            <p style="color:#6b7280;font-size:12px;">Questions? Reply to this email or contact us at contact@aureotrack.com</p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, enrollmentId: enrollment.id });
  } catch (error) {
    console.error('Training enrollment error:', error);
    return NextResponse.json({ error: 'Failed to process enrollment' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('training_enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, enrollments: data });
  } catch (error) {
    console.error('Training fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { enrollmentId, paid, status, notes, adminKey } = await request.json();

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from('training_enrollments')
      .update({
        paid: paid ?? undefined,
        status: status ?? undefined,
        notes: notes ?? undefined,
        paid_at: paid ? new Date().toISOString() : undefined,
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Training update error:', error);
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
  }
}