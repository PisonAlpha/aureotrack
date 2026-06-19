import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const school = searchParams.get('school');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const query = supabaseAdmin
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true });

    if (school) query.eq('school', school);

    const { data: courses, error } = await query;
    if (error) throw error;

    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    const { data: attempts } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId);

    const enriched = (courses || []).map(course => ({
      ...course,
      completed: progress?.some(p => p.course_id === course.id && p.completed) || false,
      quizPassed: attempts?.some(a => a.course_id === course.id && a.passed) || false,
    }));

    return NextResponse.json({ success: true, courses: enriched });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}