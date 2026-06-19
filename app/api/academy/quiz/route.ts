import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId, score, total } = await request.json();

    if (!userId || !courseId || score === undefined || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const passed = (score / total) >= 0.7;

    const { data: attempt, error } = await supabaseAdmin
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        course_id: courseId,
        score,
        total,
        passed,
      })
      .select()
      .single();

    if (error) throw error;

    if (passed) {
      await supabaseAdmin
        .from('user_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,course_id' });
    }

    const { data: completedInSchool } = await supabaseAdmin
      .from('user_progress')
      .select('*, courses!inner(*)')
      .eq('user_id', userId)
      .eq('completed', true);

    const { data: courseData } = await supabaseAdmin
      .from('courses')
      .select('school')
      .eq('id', courseId)
      .single();

    const school = courseData?.school;
    let certEarned = null;

    if (school && passed) {
      const { data: schoolCourses } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('school', school);

      const completedSchoolCourses = (completedInSchool || [])
        .filter((p: any) => p.courses?.school === school).length;

      const totalSchoolCourses = schoolCourses?.length || 0;

      if (completedSchoolCourses >= totalSchoolCourses && totalSchoolCourses > 0) {
        const { data: existingCert } = await supabaseAdmin
          .from('certifications')
          .select('id')
          .eq('user_id', userId)
          .eq('school', school)
          .single();

        if (!existingCert) {
          const levelMap: Record<string, string> = {
            'Beginner': 'Level 1 - Beginner',
            'Forex': 'Level 2 - Intermediate',
            'Crypto': 'Level 2 - Intermediate',
            'Technical Analysis': 'Level 3 - Advanced',
            'Risk Management': 'Level 3 - Advanced',
            'Psychology': 'Level 4 - Professional',
          };

          const certificateId = 'AT-' + school.substring(0, 3).toUpperCase() + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

          const { data: cert } = await supabaseAdmin
            .from('certifications')
            .insert({
              user_id: userId,
              level: levelMap[school] || 'Level 1 - Beginner',
              school,
              certificate_id: certificateId,
            })
            .select()
            .single();

          certEarned = cert;
        }
      }
    }

    return NextResponse.json({
      success: true,
      passed,
      score,
      total,
      certEarned,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}