import Redis from 'ioredis';

const INDEX_KEY = 'chat:index';

function getRedisUrl() {
  const url = process.env.KV_REST_API_REDIS_URL || process.env.KV_URL || '';
  if (!url) throw new Error('No Redis/KV configuration found');
  return url;
}

// Vercel KV (Upstash) — plain redis:// URL, no TLS needed locally
const kv = new Redis(getRedisUrl(), {
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});

// Handle connection errors gracefully
kv.on('error', (err: any) => {
  if (err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT') return;
  console.warn('[redis]', err?.message);
});

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

// ---- Heartbeat (online status) ----

function heartbeatKey(sessionId: string) {
  return `chat:heartbeat:${sessionId}`;
}

export async function updateSessionHeartbeat(sessionId: string): Promise<void> {
  try {
    await kv.set(heartbeatKey(sessionId), String(Date.now()), 'EX', 90);
  } catch {
    // silently fail
  }
}

export async function getHeartbeats(sessionIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (sessionIds.length === 0) return map;
  try {
    const keys = sessionIds.map(heartbeatKey);
    const values = await kv.mget(...keys);
    for (let i = 0; i < sessionIds.length; i++) {
      const val = values[i];
      if (val) {
        const ts = parseInt(val as string, 10);
        if (!isNaN(ts)) map.set(sessionIds[i], ts);
      }
    }
  } catch {
    // silently fail
  }
  return map;
}
