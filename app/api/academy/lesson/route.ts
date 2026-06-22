import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { topic, category, courseId } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    // Check cache first
    if (courseId) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('courses')
          .select('lesson_content')
          .eq('id', courseId)
          .single();

        if (cached?.lesson_content) {
          console.log('Returning cached lesson for:', topic);
          return NextResponse.json({ success: true, lesson: cached.lesson_content, cached: true });
        }
      } catch (cacheError) {
        console.error('Cache check error:', cacheError);
      }
    }

    console.log('Generating lesson for:', topic);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: 'You are an expert trading instructor writing a lesson for AureoTrack\'s Trading Academy. Write a clear, beginner-friendly lesson on: "' + topic + '" (category: ' + category + ').\n\nRespond ONLY with valid JSON, no markdown, no preamble, no backticks, in this exact format:\n{"title":"lesson title","introduction":"2-3 sentence intro","sections":[{"heading":"section heading","content":"3-5 sentence explanation"}],"keyTakeaways":["takeaway1","takeaway2","takeaway3"],"quizQuestion":{"question":"test question","options":["A","B","C","D"],"correctIndex":0}}\n\nInclude 3-4 sections. Keep it educational and practical.',
      }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    if (!textBlock || !('text' in textBlock)) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    let text = textBlock.text.trim();
    console.log('Raw AI response length:', text.length);

    // Strip any markdown formatting
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Find JSON boundaries
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON found in response:', text.substring(0, 200));
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    let lesson;
    try {
      lesson = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'String:', jsonString.substring(0, 200));
      return NextResponse.json({ error: 'Failed to parse lesson content' }, { status: 500 });
    }

    // Validate required fields
    if (!lesson.title || !lesson.introduction || !lesson.sections || !lesson.keyTakeaways) {
      console.error('Missing required fields in lesson:', Object.keys(lesson));
      return NextResponse.json({ error: 'Incomplete lesson content' }, { status: 500 });
    }

    // Save to cache
    if (courseId) {
      try {
        await supabaseAdmin
          .from('courses')
          .update({ lesson_content: lesson })
          .eq('id', courseId);
        console.log('Lesson cached for courseId:', courseId);
      } catch (saveError) {
        console.error('Cache save error:', saveError);
      }
    }

    return NextResponse.json({ success: true, lesson, cached: false });
  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json({ error: 'Failed to generate lesson: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}