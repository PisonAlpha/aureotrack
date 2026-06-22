import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, starting_balance } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id, email_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (!existing.email_verified) {
        // Resend verification code
        const code = generateVerificationCode();
        const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        await supabaseAdmin
          .from('users')
          .update({ verification_code: code, verification_code_expires_at: expires })
          .eq('id', existing.id);
        await sendVerificationEmail(email, full_name, code);
        return NextResponse.json({
          error: 'Account exists but not verified. A new code has been sent to your email.',
          needsVerification: true,
          userId: existing.id,
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Create user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        full_name,
        email_verified: false,
        verification_code: code,
        verification_code_expires_at: expires,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create demo account
    const balance = starting_balance || 100000;
    await supabaseAdmin
      .from('demo_accounts')
      .insert({ user_id: user.id, balance, initial_balance: balance });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, full_name, code);
    if (!emailSent) {
      console.error('Failed to send verification email to:', email);
    }

    return NextResponse.json({
      success: true,
      needsVerification: true,
      userId: user.id,
      message: 'Account created! Please check your email for a verification code.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}