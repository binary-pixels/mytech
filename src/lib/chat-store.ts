import { put, list, del } from '@vercel/blob';

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

const INDEX_PATH = 'chat/index.json';

function sessionPath(id: string) {
  return `chat/sessions/${id}.json`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Find the blob URL for a given pathname by listing with prefix */
async function findBlobUrl(pathname: string): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: pathname });
    return blobs.find((b) => b.pathname === pathname)?.url || null;
  } catch {
    return null;
  }
}

export async function readIndex(): Promise<SessionIndexEntry[]> {
  const url = await findBlobUrl(INDEX_PATH);
  if (!url) return [];
  const data = await fetchJson<SessionIndexEntry[]>(url);
  return data || [];
}

export async function writeIndex(entries: SessionIndexEntry[]) {
  const content = JSON.stringify(entries, null, 2);
  await put(INDEX_PATH, content, {
    access: 'public',
    addRandomSuffix: false,
  });
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
  const pathname = sessionPath(id);
  const url = await findBlobUrl(pathname);
  if (!url) return null;
  return await fetchJson<ChatSession>(url);
}

export async function writeSession(session: ChatSession) {
  const content = JSON.stringify(session, null, 2);
  await put(sessionPath(session.id), content, {
    access: 'public',
    addRandomSuffix: false,
  });
}

export async function deleteSessionFile(id: string) {
  const pathname = sessionPath(id);
  try {
    const { blobs } = await list({ prefix: pathname });
    for (const blob of blobs) {
      if (blob.pathname === pathname) {
        await del(blob.url);
      }
    }
  } catch {
    // silently fail
  }
}
