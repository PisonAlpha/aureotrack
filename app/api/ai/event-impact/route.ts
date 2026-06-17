import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { event } = await request.json();

    if (!event || event.trim().length < 3) {
      return NextResponse.json({ error: 'Please describe a market event or scenario' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: 'You are a market analyst for AureoTrack. A user wants to simulate the potential market impact of this event or scenario: "' + event + '"\n\n' +
          'Provide an educational analysis of how this type of event has historically affected markets, and what the likely directional impact would be on major asset classes.\n\n' +
          'Respond ONLY with valid JSON, no markdown, no preamble, in this exact format:\n' +
          '{ "eventSummary": "1 sentence restating the event", "historicalContext": "2-3 sentences on how similar events have played out historically", "impacts": [ { "asset": "Bitcoin", "direction": "Positive" | "Negative" | "Neutral", "reasoning": "short reasoning" }, { "asset": "Gold", "direction": "Positive" | "Negative" | "Neutral", "reasoning": "short reasoning" }, { "asset": "US Dollar (DXY)", "direction": "Positive" | "Negative" | "Neutral", "reasoning": "short reasoning" }, { "asset": "Stock Market", "direction": "Positive" | "Negative" | "Neutral", "reasoning": "short reasoning" } ], "disclaimer": "This is an educational simulation, not financial advice or a guaranteed prediction." }',
      }],
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Event impact error:', error);
    return NextResponse.json({ error: 'Failed to simulate event impact' }, { status: 500 });
  }
}