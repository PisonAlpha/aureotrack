import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { question, history } = await request.json();

    if (!question || question.trim().length < 2) {
      return NextResponse.json({ error: 'Please ask a question' }, { status: 400 });
    }

    const conversationHistory = (history || []).slice(-6).map((h: any) => ({
      role: h.role,
      content: h.content,
    }));

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: 'You are the AI Learning Assistant for AureoTrack, a trading education platform. Answer trading, crypto, and finance questions clearly and concisely, in plain text (no markdown formatting, no asterisks). Keep answers to 3-5 sentences unless the question requires more depth. Use simple analogies for complex concepts. If asked something completely unrelated to trading/finance/markets, gently redirect to trading topics.',
      messages: [...conversationHistory, { role: 'user', content: question }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const answer = textBlock && 'text' in textBlock ? textBlock.text : 'Sorry, I could not generate a response.';

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}