'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  lastActivity: string;
  messages: Message[];
}

const POLL_INTERVAL = 3000;

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [fullSession, setFullSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevMsgCountRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const [voiceLang, setVoiceLang] = useState<'zh-CN' | 'en-US'>('zh-CN');

  // Voice message context menu (long-press for translation)
  const [contextMenuMsgId, setContextMenuMsgId] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Translation state
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Pagination & search
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);

  const activeSession = fullSession;

  // Poll sessions
  useEffect(() => {
    async function fetchSessions() {
      try {
        const params = new URLSearchParams({ sessionId: 'list', page: String(page), limit: '50' });
        if (searchQuery) params.set('search', searchQuery);
        const res = await fetch(`/api/chat/session?${params}`);
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setTotalPages(data.totalPages || 1);
          setTotalSessions(data.total || 0);
        }
      } catch {}
    }
    fetchSessions();
    const interval = setInterval(fetchSessions, POLL_INTERVAL);
    return () => {
      clearInterval(interval);
      stopRecordingCleanup();
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, [page, searchQuery]);

  // Fetch full session data when a session is selected
  useEffect(() => {
    if (!activeSessionId) { setFullSession(null); return; }
    async function load() {
      try {
        const res = await fetch(`/api/chat/session?sessionId=${activeSessionId}`);
        if (res.ok) setFullSession(await res.json());
      } catch {}
    }
    load();
  }, [activeSessionId]);

  // Track scroll position via native event — only auto-scroll when user is near bottom
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const handler = () => {
      const threshold = 120;
      shouldAutoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Auto-scroll only on actual new messages (not on every poll)
  useEffect(() => {
    const count = activeSession?.messages?.length ?? 0;
    const hasNewMessages = count > prevMsgCountRef.current && prevMsgCountRef.current > 0;
    prevMsgCountRef.current = count;

    if (hasNewMessages && shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  // Close context menu on click outside
  useEffect(() => {
    if (!contextMenuMsgId) return;
    function handler(e: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenuMsgId(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenuMsgId]);

  function stopRecordingCleanup() {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }

  async function sendReply(text = '', imageUrl = '', audioUrl = '') {
    if (!text && !imageUrl && !audioUrl) return;
    if (!activeSessionId) return;
    setInput('');
    setSending(true);

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          role: 'agent',
          text,
          imageUrl,
          audioUrl,
        }),
      });

      // Refresh with same pagination
      const params = new URLSearchParams({ sessionId: 'list', page: String(page), limit: '50' });
      if (searchQuery) params.set('search', searchQuery);
      const res = await fetch(`/api/chat/session?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setTotalPages(data.totalPages || 1);
        setTotalSessions(data.total || 0);
      }
    } catch {}
    setSending(false);
  }

  function handleSendText() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    sendReply(text, '', '');
  }

  // Image upload
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAndSend(file, 'image');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Voice recording
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      // Upload function (called when both audio and transcript are ready)
      let pendingAudio: { blob: Blob; ext: string; mimeType: string } | null = null;
      let transcriptReady = false;

      async function doUpload() {
        if (!pendingAudio) return;
        setRecording(false);
        const { blob, ext, mimeType } = pendingAudio;
        const file = new File([blob], `voice.${ext}`, { type: mimeType });
        const transcript = voiceTranscriptRef.current || interimTranscriptRef.current;
        await uploadAndSend(file, 'audio', transcript);
        pendingAudio = null;
      }

      // Start SpeechRecognition in parallel for transcription
      voiceTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      let transcriptRecognition: SpeechRecognitionInstance | null = null;
      if (SpeechRecognitionAPI) {
        const sr = new SpeechRecognitionAPI();
        sr.lang = voiceLang;
        sr.interimResults = true;
        sr.continuous = true;
        sr.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript.trim();
              if (text) {
                const sep = voiceTranscriptRef.current ? '. ' : '';
                voiceTranscriptRef.current += sep + text;
              }
            }
          }
          // Track full transcript including interim as fallback
          let full = voiceTranscriptRef.current;
          for (let i = 0; i < event.results.length; i++) {
            if (!event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              if (text) {
                full += (full ? ' ' : '') + text;
              }
            }
          }
          if (full) interimTranscriptRef.current = full;
        };
        sr.onend = async () => {
          // SpeechRecognition finalized — transcript is complete
          if (pendingAudio && !transcriptReady) {
            transcriptReady = true;
            await doUpload();
          }
        };
        sr.start();
        transcriptRecognition = sr;
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (chunks.length === 0) { setRecording(false); return; }

        const mimeType = recorder.mimeType || 'audio/webm';
        const ext = mimeType.includes('mp4') ? 'm4a' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });
        pendingAudio = { blob, ext, mimeType };

        if (transcriptRecognition) {
          try { transcriptRecognition.stop(); } catch {}
          // Fallback: upload after 800ms regardless of SR state
          setTimeout(async () => {
            if (!transcriptReady) {
              transcriptReady = true;
              setRecording(false);
              await doUpload();
            }
          }, 800);
        } else {
          // No speech recognition available — upload immediately
          transcriptReady = true;
          setRecording(false);
          await doUpload();
        }
      };

      recorder.start();
      setRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          const next = t + 1;
          if (next >= 60) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
            }
          }
          return next;
        });
      }, 1000);
    } catch {
      setRecording(false);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }

  async function uploadAndSend(file: File, kind: 'image' | 'audio', transcript = '') {
    setSending(true);
    try {
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;
      await sendReply(
        kind === 'audio' ? transcript : '',
        kind === 'image' ? dataUrl : '',
        kind === 'audio' ? dataUrl : ''
      );
    } catch {}
    setSending(false);
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Long-press handlers for voice messages
  function startLongPress(msgId: string) {
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuMsgId((prev) => (prev === msgId ? null : msgId));
    }, 600);
  }

  function cancelLongPress() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  // Translation
  async function translateMessage(msgId: string, text: string, targetLang: 'zh' | 'en') {
    if (translations[msgId]) {
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
      return;
    }
    setTranslatingId(msgId);
    try {
      const res = await fetch('/api/chat/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (data.translated) {
        setTranslations((prev) => ({ ...prev, [msgId]: data.translated }));
      }
    } catch {}
    setTranslatingId(null);
  }

  function getLastMessagePreview(session: ChatSession): string {
    if (!session.messages || session.messages.length === 0) return '';
    const last = session.messages[session.messages.length - 1];
    if (last.imageUrl) return '[Image]';
    if (last.audioUrl) return last.text ? `[Voice] ${last.text.slice(0, 40)}` : '[Voice]';
    return last.text.slice(0, 60) || '';
  }

  function getUnreadCount(session: ChatSession): number {
    if (!session.messages) return 0;
    let count = 0;
    for (let i = session.messages.length - 1; i >= 0; i--) {
      if (session.messages[i].role === 'customer') count++;
      else break;
    }
    return count;
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function formatMsgTime(iso: string) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${y}/${mo}/${dd} ${hh}:${mm}`;
  }

  function isChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
  }

  function getTargetLang(text: string): 'zh' | 'en' {
    return isChinese(text) ? 'en' : 'zh';
  }

  async function downloadAllSessions() {
    try {
      const res = await fetch('/api/chat/session?sessionId=list&export=true');
      if (!res.ok) return;
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.sessions, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Session List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-gray-900">Chat Sessions</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadAllSessions}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Download all chat history as JSON"
              >
                ↓ Export
              </button>
              <span className="text-xs text-gray-400">{totalSessions} total</span>
            </div>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              {searchQuery ? (
                <>
                  <p>No matching sessions</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <p>No active sessions</p>
                  <p className="text-xs mt-1">Waiting for visitors...</p>
                </>
              )}
            </div>
          )}
          {sessions.map((session) => {
            const unread = getUnreadCount(session);
            return (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  activeSessionId === session.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {session.customerName || 'Anonymous'}
                  </span>
                  {unread > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {getLastMessagePreview(session)}
                </p>
                {session.customerEmail && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{session.customerEmail}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 p-3 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeSession ? (
          <>
            <div className="px-6 py-3 border-b border-gray-200 bg-white">
              <span className="font-semibold text-gray-900">
                {activeSession.customerName || 'Anonymous'}
              </span>
              {activeSession.customerEmail && (
                <span className="text-xs text-gray-400 ml-2">({activeSession.customerEmail})</span>
              )}
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {activeSession.messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No messages yet
                </div>
              )}
              {activeSession.messages.map((msg) => {
                const targetLang = msg.text ? getTargetLang(msg.text) : 'en';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.role === 'agent'
                          ? 'bg-blue-700 text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-[10px] font-medium opacity-60">
                          {msg.role === 'agent' ? 'You' : 'Visitor'}
                        </p>
                        {msg.text && !msg.audioUrl && (
                          <button
                            onClick={() => translateMessage(msg.id, msg.text, targetLang)}
                            disabled={translatingId === msg.id}
                            className="text-[10px] px-1.5 py-0.5 rounded opacity-60 hover:opacity-100 hover:bg-black/10 transition-opacity disabled:opacity-30"
                            title={`Translate to ${targetLang === 'zh' ? 'Chinese' : 'English'}`}
                          >
                            {translatingId === msg.id ? '...' : '\uD83C\uDF10'}
                          </button>
                        )}
                      </div>
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Shared image"
                          className="mt-1.5 rounded-lg max-w-full max-h-64 object-cover cursor-pointer"
                          loading="lazy"
                          onClick={() => window.open(msg.imageUrl, '_blank')}
                        />
                      )}
                      {msg.audioUrl ? (
                        <div className="mt-1.5">
                          <div
                            onMouseDown={() => startLongPress(msg.id)}
                            onMouseUp={cancelLongPress}
                            onMouseLeave={cancelLongPress}
                            onTouchStart={() => startLongPress(msg.id)}
                            onTouchEnd={cancelLongPress}
                            onTouchMove={cancelLongPress}
                            className="cursor-default"
                          >
                            <audio
                              controls
                              preload="metadata"
                              className="w-full max-w-[240px] h-8"
                              src={msg.audioUrl}
                            >
                              Your browser does not support the audio element.
                            </audio>
                            {msg.text && (
                              <p className="text-xs italic opacity-70 mt-1 leading-relaxed whitespace-pre-wrap">
                                &ldquo;{msg.text}&rdquo;
                              </p>
                            )}
                          </div>
                          {contextMenuMsgId === msg.id && (
                            <div ref={contextMenuRef} className="mt-2 flex gap-2">
                              <button
                                onClick={() => {
                                  translateMessage(msg.id, msg.text || '', 'en');
                                  setContextMenuMsgId(null);
                                }}
                                disabled={translatingId === msg.id}
                                className="text-[11px] px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50"
                              >
                                English
                              </button>
                              <button
                                onClick={() => {
                                  translateMessage(msg.id, msg.text || '', 'zh');
                                  setContextMenuMsgId(null);
                                }}
                                disabled={translatingId === msg.id}
                                className="text-[11px] px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50"
                              >
                                中文
                              </button>
                            </div>
                          )}
                          {translations[msg.id] && (
                            <p className="text-xs leading-relaxed mt-1.5 pt-1.5 border-t border-current/20 italic opacity-80">
                              {translations[msg.id]}
                            </p>
                          )}
                        </div>
                      ) : (
                        msg.text && (
                          <div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            {translations[msg.id] && (
                              <p className="text-sm leading-relaxed mt-1.5 pt-1.5 border-t border-current/20 italic opacity-80">
                                {translations[msg.id]}
                              </p>
                            )}
                          </div>
                        )
                      )}
                      <p className={`text-[10px] mt-1 ${msg.role === 'agent' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {formatMsgTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-3 items-end">
                {/* Image upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                  className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                  title="Send image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {/* Voice recording */}
                <button
                  onClick={recording ? stopRecording : startRecording}
                  disabled={sending}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 shrink-0 ${
                    recording
                      ? 'text-red-600 bg-red-50 animate-pulse'
                      : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  title={recording ? 'Stop recording' : 'Record voice'}
                >
                  {recording ? (
                    <span className="flex items-center gap-1 text-xs font-medium">
                      <span className="w-2 h-2 bg-red-600 rounded-full" />
                      {formatTime(recordingTime)}
                    </span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>

                {/* Transcription language toggle */}
                <button
                  onClick={() => setVoiceLang((prev) => (prev === 'zh-CN' ? 'en-US' : 'zh-CN'))}
                  disabled={recording}
                  className="text-[10px] px-1.5 py-1 rounded font-medium shrink-0 transition-colors disabled:opacity-30 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  title={`Transcription language: ${voiceLang === 'zh-CN' ? 'Chinese' : 'English'}`}
                >
                  {voiceLang === 'zh-CN' ? '中' : 'EN'}
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                  placeholder='Type your reply...'
                  rows={2}
                  className='flex-1 px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none border-gray-300'
                />
                <button
                  onClick={handleSendText}
                  disabled={sending || !input.trim()}
                  className="px-6 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium self-end shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-sm font-medium">Select a session to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
