import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { topic, category } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: 'You are an expert trading instructor writing a lesson for AureoTrack\'s Trading Academy. Write a clear, beginner-friendly lesson on: "' + topic + '" (category: ' + category + ').\n\n' +
          'Respond ONLY with valid JSON, no markdown, no preamble, in this exact format:\n' +
          '{ "title": "lesson title", "introduction": "2-3 sentence intro to the topic", "sections": [ { "heading": "section heading", "content": "3-5 sentence explanation" } ], "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"], "quizQuestion": { "question": "a question testing understanding", "options": ["option A", "option B", "option C", "option D"], "correctIndex": number } }\n\n' +
          'Include 3-4 sections. Keep the tone educational and practical, suitable for someone learning to trade. Use real examples where helpful.',
      }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const lesson = JSON.parse(clean);

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 });
  }
}