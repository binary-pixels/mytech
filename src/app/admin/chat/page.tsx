'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: string;
  text: string;
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
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Poll sessions
  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/chat/session?sessionId=list');
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch {}
    }
    fetchSessions();
    const interval = setInterval(fetchSessions, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  async function sendReply() {
    if (!input.trim() || !activeSessionId) return;
    const text = input.trim();
    setInput('');

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          role: 'agent',
          text,
        }),
      });

      // Refresh
      const res = await fetch('/api/chat/session?sessionId=list');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch {}
  }

  function getLastMessagePreview(session: ChatSession): string {
    if (session.messages.length === 0) return 'No messages';
    const last = session.messages[session.messages.length - 1];
    return last.text.slice(0, 60) || '';
  }

  function getUnreadCount(session: ChatSession): number {
    let count = 0;
    for (let i = session.messages.length - 1; i >= 0; i--) {
      if (session.messages[i].role === 'customer') count++;
      else break;
    }
    return count;
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Session List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-bold text-gray-900">Chat Sessions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              <p>No active sessions</p>
              <p className="text-xs mt-1">Waiting for visitors...</p>
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

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeSession.messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No messages yet
                </div>
              )}
              {activeSession.messages.map((msg) => (
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
                    <p className="text-[10px] font-medium opacity-60 mb-1">
                      {msg.role === 'agent' ? 'You' : 'Visitor'}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
                <button
                  onClick={sendReply}
                  disabled={!input.trim()}
                  className="px-6 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium self-end"
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
