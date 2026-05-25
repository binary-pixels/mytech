import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(process.cwd(), 'src/data/chat/sessions.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, role, text } = body;

    if (!sessionId || !role || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const sessions = JSON.parse(raw);
    const session = sessions.find((s: { id: string }) => s.id === sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const message = {
      id: `msg-${Date.now()}`,
      role,
      text,
      createdAt: new Date().toISOString(),
    };

    session.messages.push(message);
    session.lastActivity = new Date().toISOString();

    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
