import { NextResponse } from 'next/server';
import {
  readIndex,
  writeIndex,
  readSession,
  writeSession,
  ChatSession,
} from '@/lib/chat-store';

function mergeSessions(entries: { id: string; customerName: string; customerEmail: string; lastActivity: string }[]): { id: string; customerName: string; customerEmail: string; lastActivity: string }[] {
  const emailMap = new Map<string, typeof entries[0]>();

  for (const e of entries) {
    const key = e.customerEmail || e.id;
    const existing = emailMap.get(key);
    if (!existing) {
      emailMap.set(key, { ...e });
    } else {
      if (new Date(e.lastActivity) > new Date(existing.lastActivity)) {
        existing.lastActivity = e.lastActivity;
      }
      if (e.customerName && e.customerName !== 'Anonymous') {
        existing.customerName = e.customerName;
      }
    }
  }

  return Array.from(emailMap.values())
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const isExport = searchParams.get('export') === 'true';

  if (sessionId && sessionId !== 'list') {
    const session = await readSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json(session);
  }

  // Export mode: load full session data for all entries
  if (isExport) {
    const index = await readIndex();
    const full: (ChatSession & { mergedEmail?: string })[] = [];
    const seen = new Set<string>();
    for (const entry of index) {
      const key = entry.customerEmail || entry.id;
      if (seen.has(key)) continue;
      seen.add(key);
      const session = await readSession(entry.id);
      if (session) {
        const siblings = entry.customerEmail
          ? index.filter((e) => e.customerEmail === entry.customerEmail)
          : [entry];
        let allMessages = [...session.messages];
        for (const sib of siblings) {
          if (sib.id === entry.id) continue;
          const sibSession = await readSession(sib.id);
          if (sibSession) {
            allMessages = allMessages.concat(sibSession.messages);
          }
        }
        const msgMap = new Map<string, typeof allMessages[0]>();
        for (const m of allMessages) msgMap.set(m.id, m);
        allMessages = Array.from(msgMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        full.push({ ...session, messages: allMessages, mergedEmail: entry.customerEmail || undefined });
      }
    }
    return NextResponse.json({ sessions: full, total: full.length });
  }

  // List mode — read from index
  let merged = mergeSessions(await readIndex());

  const search = searchParams.get('search')?.toLowerCase();
  if (search) {
    merged = merged.filter(
      (s) =>
        s.customerName.toLowerCase().includes(search) ||
        s.customerEmail.toLowerCase().includes(search)
    );
  }

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const total = merged.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = merged.slice(start, start + limit);

  return NextResponse.json({
    sessions: paginated,
    total,
    page,
    limit,
    totalPages,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const index = await readIndex();

    if (body.email) {
      const existing = index.find((s) => s.customerEmail === body.email);
      if (existing) {
        const session = await readSession(existing.id);
        if (session) {
          session.customerName = body.name || session.customerName;
          session.lastActivity = new Date().toISOString();
          await writeSession(session);

          const updatedIndex = index.filter((s) => s.customerEmail !== body.email);
          updatedIndex.push({
            id: existing.id,
            customerName: session.customerName,
            customerEmail: body.email,
            lastActivity: session.lastActivity,
          });
          await writeIndex(updatedIndex);

          return NextResponse.json({ sessionId: existing.id }, { status: 200 });
        }
      }
    }

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      customerName: body.name || 'Anonymous',
      customerEmail: body.email || '',
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role: 'customer',
          text: body.firstMessage || '',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    await writeSession(session);

    const idx = await readIndex();
    idx.push({
      id: session.id,
      customerName: session.customerName,
      customerEmail: session.customerEmail,
      lastActivity: session.lastActivity,
    });
    await writeIndex(idx);

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
