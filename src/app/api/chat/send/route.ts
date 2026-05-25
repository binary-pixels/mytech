import { NextResponse } from 'next/server';
import { readSession, writeSession, updateIndexEntry } from '@/lib/chat-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, role, text, imageUrl, audioUrl } = body;

    if (!sessionId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!text && !imageUrl && !audioUrl) {
      return NextResponse.json({ error: 'Message must have text, image, or audio' }, { status: 400 });
    }

    const session = readSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.messages.length >= 500) {
      return NextResponse.json({ error: 'Session message limit reached' }, { status: 400 });
    }

    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role,
      text: text || '',
      imageUrl: imageUrl || '',
      audioUrl: audioUrl || '',
      createdAt: new Date().toISOString(),
    };

    session.messages.push(message);
    session.lastActivity = new Date().toISOString();

    writeSession(session);
    updateIndexEntry(sessionId, { lastActivity: session.lastActivity, customerName: session.customerName });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
