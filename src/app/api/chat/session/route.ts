import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(process.cwd(), 'src/data/chat/sessions.json');

interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  lastActivity: string;
  messages: { id: string; role: string; text: string; createdAt: string }[];
}

function readSessions(): ChatSession[] {
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSessions(sessions: ChatSession[]): void {
  const dir = path.dirname(SESSIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  const sessions = readSessions();

  if (sessionId && sessionId !== 'list') {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json(session);
  }

  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessions = readSessions();

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      customerName: body.name || 'Anonymous',
      customerEmail: body.email || '',
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'customer',
          text: body.firstMessage || '',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    sessions.push(session);
    writeSessions(sessions);

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
