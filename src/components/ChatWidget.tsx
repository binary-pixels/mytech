'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  role: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
}

export default function ChatWidget() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevMsgCountRef = useRef(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
  const [startingSession, setStartingSession] = useState(false);

  // Voice message context menu (long-press for translation)
  const [contextMenuMsgId, setContextMenuMsgId] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Translation state
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const composingRef = useRef(false);
  const compositionEndRef = useRef(0);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      stopRecordingCleanup();
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  // Heartbeat: ping server every 15s while chat is open to show online status
  useEffect(() => {
    if (!sessionId || step !== 'chat') return;
    const heartbeat = async () => {
      try {
        await fetch('/api/chat/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch {}
    };
    heartbeat();
    heartbeatRef.current = setInterval(heartbeat, 15000);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [sessionId, step]);

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

  useEffect(() => {
    const count = messages.length;
    const hasNewMessages = count > prevMsgCountRef.current && prevMsgCountRef.current > 0;
    prevMsgCountRef.current = count;

    if (hasNewMessages && shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  async function startSession() {
    if (!email.trim()) return;
    const derivedName = email.trim().split('@')[0];
    // Show chat UI immediately, create session in background
    setStep('chat');
    setStartingSession(true);
    try {
      const res = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: derivedName, email: email.trim(), firstMessage: '' }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);

      // Load existing messages immediately (resume chat)
      const existing = await fetchMessages(data.sessionId);
      if (existing) setMessages(existing);

      setStartingSession(false);
      pollingRef.current = setInterval(async () => {
        const msgs = await fetchMessages(data.sessionId);
        if (msgs) setMessages(msgs);
      }, 3000);
    } catch {
      setStartingSession(false);
    }
  }

  async function fetchMessages(sid: string): Promise<Message[] | null> {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sid}`);
      const data = await res.json();
      return data.messages || [];
    } catch {
      return null;
    }
  }

  async function sendMessage(text = '', imageUrl = '', audioUrl = '') {
    if (!text && !imageUrl && !audioUrl) return;
    if (!sessionId) return;
    setSending(true);
    setInput('');

    // Optimistic: show message immediately
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      role: 'customer',
      text,
      imageUrl: imageUrl || undefined,
      audioUrl: audioUrl || undefined,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, role: 'customer', text, imageUrl, audioUrl }),
      });

      const msgs = await fetchMessages(sessionId);
      if (msgs) setMessages(msgs);
    } catch {}
    setSending(false);
  }

  function handleSendText() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    sendMessage(text, '', '');
  }

  // Image upload handling
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

      // Start SpeechRecognition in parallel to transcribe voice to text
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
            // Auto-stop at 60 seconds
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
      // Convert file to base64 data URL — no server upload needed
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;
      await sendMessage(
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
        resolve(result.split(',')[1]); // strip data:...;base64, prefix
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
      // Already translated - toggle off
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

  function handleClose() {
    setOpen(false);
    setContextMenuMsgId(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
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

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat dialog */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden max-h-[80vh] sm:max-h-[650px]">
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">&#x1F441;</span>
              <span className="font-semibold text-sm">VisionLab Support</span>
            </div>
            <button onClick={handleClose} className="text-white/80 hover:text-white">&times;</button>
          </div>

          {step === 'form' ? (
            <div className="p-4 flex-1 flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-4 text-center">
                Leave us a message and we&apos;ll get back to you.
              </p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !composingRef.current && Date.now() - compositionEndRef.current > 100) startSession(); }}
                onCompositionStart={() => { composingRef.current = true; }}
                onCompositionEnd={() => { composingRef.current = false; compositionEndRef.current = Date.now(); }}
                placeholder="Your email"
                type="email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={startSession}
                disabled={!email.trim() || startingSession}
                className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors text-sm"
              >
                {startingSession ? 'Connecting...' : 'Start Chat'}
              </button>
            </div>
          ) : (
            <>
              <div
                ref={chatContainerRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
              >
                {messages.length === 0 && !startingSession && (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    <p>Send a message to start the conversation.</p>
                  </div>
                )}
                {messages.length === 0 && startingSession && (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    <div className="animate-pulse space-y-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto" />
                      <p>Connecting...</p>
                    </div>
                  </div>
                )}
                {messages.map((msg) => {
                  const targetLang = msg.text ? getTargetLang(msg.text) : 'en';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          msg.role === 'agent'
                            ? 'bg-gray-100 text-gray-900 rounded-tl-sm'
                            : 'bg-blue-700 text-white rounded-tr-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-[10px] font-medium opacity-60">
                            {msg.role === 'agent' ? 'Support' : 'You'}
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
                            className="mt-1.5 rounded-lg max-w-full max-h-48 object-cover cursor-pointer"
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
                                className="w-full max-w-[200px] h-8"
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
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                              </p>
                              {translations[msg.id] && (
                                <p className="text-sm leading-relaxed mt-1.5 pt-1.5 border-t border-current/20 italic opacity-80">
                                  {translations[msg.id]}
                                </p>
                              )}
                            </div>
                          )
                        )}
                        <p className={`text-[10px] mt-1 ${msg.role === 'agent' ? 'text-gray-400' : 'text-blue-200'}`}>
                          {formatMsgTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 p-3">
                <div className="flex gap-1 items-end">
                  {/* Image upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                    className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 shrink-0"
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
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 shrink-0 ${
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

                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !composingRef.current && Date.now() - compositionEndRef.current > 100) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    onCompositionStart={() => { composingRef.current = true; }}
                    onCompositionEnd={() => { composingRef.current = false; compositionEndRef.current = Date.now(); }}
                    disabled={startingSession}
                    placeholder={startingSession ? 'Connecting...' : 'Type a message...'}
                    className='flex-1 px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed'
                  />
                  <button
                    onClick={handleSendText}
                    disabled={sending || !input.trim() || startingSession}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
