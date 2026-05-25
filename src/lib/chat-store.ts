import Redis from 'ioredis';

const INDEX_KEY = 'chat:index';

function getRedisUrl() {
  const url = process.env.KV_REST_API_REDIS_URL || process.env.KV_URL || '';
  if (!url) throw new Error('No Redis/KV configuration found');
  return url;
}

const kv = new Redis(getRedisUrl());

// Handle connection errors gracefully
kv.on('error', () => { /* suppressed — errors caught at call sites */ });

export interface ChatMessage {
  id: string;
  role: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  lastActivity: string;
  messages: ChatMessage[];
}

interface SessionIndexEntry {
  id: string;
  customerName: string;
  customerEmail: string;
  lastActivity: string;
}

function sessionKey(id: string) {
  return `chat:session:${id}`;
}

export async function readIndex(): Promise<SessionIndexEntry[]> {
  try {
    const data = await kv.get(INDEX_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function writeIndex(entries: SessionIndexEntry[]) {
  try {
    await kv.set(INDEX_KEY, JSON.stringify(entries));
  } catch {
    // silently fail
  }
}

export async function updateIndexEntry(
  id: string,
  patch: Partial<SessionIndexEntry>
) {
  const index = await readIndex();
  const idx = index.findIndex((e) => e.id === id);
  if (idx !== -1) {
    index[idx] = { ...index[idx], ...patch };
    await writeIndex(index);
  }
}

export async function readSession(id: string): Promise<ChatSession | null> {
  try {
    const data = await kv.get(sessionKey(id));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function writeSession(session: ChatSession) {
  try {
    await kv.set(sessionKey(session.id), JSON.stringify(session));
  } catch {
    // silently fail
  }
}

export async function deleteSessionFile(id: string) {
  try {
    await kv.del(sessionKey(id));
  } catch {
    // silently fail
  }
}
