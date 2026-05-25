import fs from 'fs';
import path from 'path';

const SESSIONS_DIR = path.join(process.cwd(), 'src/data/chat/sessions');
const INDEX_FILE = path.join(SESSIONS_DIR, '_index.json');
const OLD_FILE = path.join(process.cwd(), 'src/data/chat/sessions.json');

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

function ensureDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

/** Migrate old sessions.json to per-session files, then remove it */
function migrateIfNeeded() {
  if (fs.existsSync(OLD_FILE)) {
    try {
      const raw = fs.readFileSync(OLD_FILE, 'utf-8');
      const sessions: ChatSession[] = JSON.parse(raw);
      ensureDir();
      const index: SessionIndexEntry[] = [];
      for (const s of sessions) {
        const filePath = path.join(SESSIONS_DIR, `${s.id}.json`);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify(s, null, 2), 'utf-8');
        }
        index.push({
          id: s.id,
          customerName: s.customerName,
          customerEmail: s.customerEmail,
          lastActivity: s.lastActivity,
        });
      }
      fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
      fs.renameSync(OLD_FILE, OLD_FILE + '.bak');
    } catch {
      // if migration fails, just leave old file
    }
  }
}

export function readIndex(): SessionIndexEntry[] {
  migrateIfNeeded();
  ensureDir();
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeIndex(entries: SessionIndexEntry[]) {
  ensureDir();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

export function updateIndexEntry(
  id: string,
  patch: Partial<SessionIndexEntry>
) {
  const index = readIndex();
  const idx = index.findIndex((e) => e.id === id);
  if (idx !== -1) {
    index[idx] = { ...index[idx], ...patch };
    writeIndex(index);
  }
}

export function readSession(id: string): ChatSession | null {
  migrateIfNeeded();
  const file = path.join(SESSIONS_DIR, `${id}.json`);
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeSession(session: ChatSession) {
  ensureDir();
  const filePath = path.join(SESSIONS_DIR, `${session.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
}

export function deleteSessionFile(id: string) {
  const file = path.join(SESSIONS_DIR, `${id}.json`);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}
