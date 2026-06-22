import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json({ error: 'User ID and code required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, verification_code, verification_code_expires_at, email_verified')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    if (!user.verification_code || user.verification_code !== code.trim()) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const expires = new Date(user.verification_code_expires_at);
    if (expires < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please register again to get a new code.' }, { status: 400 });
    }

    // Mark email as verified and clear code
    await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_code: null,
        verification_code_expires_at: null,
      })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        email_verified: true,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { sendVerificationEmail, generateVerificationCode } = await import('@/lib/email');
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from('users')
      .update({ verification_code: code, verification_code_expires_at: expires })
      .eq('id', userId);

    await sendVerificationEmail(user.email, user.full_name, code);

    return NextResponse.json({ success: true, message: 'New verification code sent' });
  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 });
  }
}