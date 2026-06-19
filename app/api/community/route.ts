import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ROOMS = ['Forex', 'Crypto', 'Gold', 'Technical Analysis', 'Market News'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get('room') || 'Crypto';

    const { data: posts, error } = await supabaseAdmin
      .from('community_posts')
      .select('*, users(full_name)')
      .eq('room', room)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ success: true, posts: posts || [], rooms: ROOMS });
  } catch (error) {
    console.error('Community fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, room, content } = await request.json();

    if (!userId || !room || !content) {
      return NextResponse.json({ error: 'User ID, room, and content required' }, { status: 400 });
    }

    if (content.trim().length < 3) {
      return NextResponse.json({ error: 'Post content too short' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const { data: post, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        user_id: userId,
        room,
        content: content.trim(),
        is_analyst: user?.role === 'analyst' || user?.role === 'admin',
      })
      .select('*, users(full_name)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Community post error:', error);
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
  }
}