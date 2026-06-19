import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*, courses(*)')
      .eq('user_id', userId)
      .eq('completed', true);

    const { data: attempts } = await supabaseAdmin
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId);

    const { data: trades } = await supabaseAdmin
      .from('demo_trades')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'closed')
      .limit(20);

    const { data: certifications } = await supabaseAdmin
      .from('certifications')
      .select('*')
      .eq('user_id', userId);

    const completedCourses = (progress || []).map((p: any) => p.courses?.title).filter(Boolean);
    const completedSchools = [...new Set((progress || []).map((p: any) => p.courses?.school).filter(Boolean))];
    const totalQuizzes = attempts?.length || 0;
    const passedQuizzes = attempts?.filter(a => a.passed).length || 0;
    const avgScore = totalQuizzes > 0 ? Math.round(((passedQuizzes / totalQuizzes) * 100)) : 0;
    const totalTrades = trades?.length || 0;
    const winningTrades = trades?.filter(t => t.pnl > 0).length || 0;
    const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;

    const learnerProfile = {
      completedCourses: completedCourses.slice(0, 10),
      completedSchools,
      totalCoursesCompleted: completedCourses.length,
      quizPerformance: { total: totalQuizzes, passed: passedQuizzes, avgScore },
      tradingPerformance: { totalTrades, winRate },
      certifications: certifications?.map(c => c.school) || [],
    };

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: 'You are the AI Mentor for AureoAcademy, a trading education platform. Analyze this learner\'s profile and create a personalized learning recommendation.\n\n' +
          'Learner Profile:\n' + JSON.stringify(learnerProfile, null, 2) + '\n\n' +
          'Respond ONLY with valid JSON, no markdown, no preamble:\n' +
          '{ "assessment": "2-3 sentence overall assessment of their progress", "strengths": ["strength1", "strength2"], "weaknesses": ["weakness1", "weakness2"], "nextSteps": ["specific action 1", "specific action 2", "specific action 3"], "recommendedSchool": "one of: Beginner, Forex, Crypto, Technical Analysis, Risk Management, Psychology", "motivationalMessage": "1 encouraging sentence" }',
      }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const recommendation = JSON.parse(clean);

    return NextResponse.json({
      success: true,
      profile: learnerProfile,
      recommendation,
    });
  } catch (error) {
    console.error('AI Mentor error:', error);
    return NextResponse.json({ error: 'Failed to generate mentor advice' }, { status: 500 });
  }
}