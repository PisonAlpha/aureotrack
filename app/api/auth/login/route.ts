import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check email verification
    if (!user.email_verified) {
      // Resend verification code
      const { sendVerificationEmail, generateVerificationCode } = await import('@/lib/email');
      const code = generateVerificationCode();
      const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      await supabaseAdmin
        .from('users')
        .update({ verification_code: code, verification_code_expires_at: expires })
        .eq('id', user.id);
      await sendVerificationEmail(user.email, user.full_name, code);

      return NextResponse.json({
        error: 'Please verify your email before logging in. A new code has been sent.',
        needsVerification: true,
        userId: user.id,
        email: user.email,
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        email_verified: user.email_verified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}