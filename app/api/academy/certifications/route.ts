import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const CERTIFICATION_REQUIREMENTS: Record<string, { school: string; requiredLevel: string[]; level: string }> = {
  'Level 1 - Beginner': { school: 'Beginner', requiredLevel: ['Beginner'], level: '1' },
  'Level 2 - Intermediate': { school: 'Forex', requiredLevel: ['Beginner', 'Intermediate'], level: '2' },
  'Level 3 - Advanced': { school: 'Crypto', requiredLevel: ['Beginner', 'Intermediate', 'Advanced'], level: '3' },
  'Level 4 - Professional': { school: 'Technical Analysis', requiredLevel: ['Beginner', 'Intermediate', 'Advanced'], level: '4' },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: certs } = await supabaseAdmin
      .from('certifications')
      .select('*')
      .eq('user_id', userId);

    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*, courses(*)')
      .eq('user_id', userId)
      .eq('completed', true);

    const { data: attempts } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('passed', true);

    const schools = ['Beginner', 'Forex', 'Crypto', 'Technical Analysis', 'Risk Management', 'Psychology'];
    const schoolProgress = schools.map(school => {
      const { data: schoolCourses } = { data: null };
      const completedInSchool = (progress || []).filter((p: any) => p.courses?.school === school).length;
      const quizPassedInSchool = (attempts || []).filter((a: any) => a.course_id).length;
      return { school, completed: completedInSchool, quizPassed: quizPassedInSchool };
    });

    return NextResponse.json({
      success: true,
      certifications: certs || [],
      schoolProgress,
    });
  } catch (error) {
    console.error('Certification fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, school, level } = await request.json();

    if (!userId || !school || !level) {
      return NextResponse.json({ error: 'User ID, school, and level required' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('certifications')
      .select('id')
      .eq('user_id', userId)
      .eq('school', school)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Certificate already issued for this school' }, { status: 400 });
    }

    const certificateId = 'AT-' + school.substring(0, 3).toUpperCase() + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const { data: cert, error } = await supabaseAdmin
      .from('certifications')
      .insert({
        user_id: userId,
        level,
        school,
        certificate_id: certificateId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, certification: cert });
  } catch (error) {
    console.error('Certification issue error:', error);
    return NextResponse.json({ error: 'Failed to issue certification' }, { status: 500 });
  }
}