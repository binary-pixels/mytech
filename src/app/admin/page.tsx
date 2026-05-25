'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, sessions: 0, images: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [blogRes, sessionsRes, imagesRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/chat/session?sessionId=list'),
          fetch('/api/upload'),
        ]);

        const posts = await blogRes.json();
        const sessions = await sessionsRes.json();
        const images = await imagesRes.json();

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          sessions: sessions.sessions?.length || 0,
          images: images.images?.length || 0,
        });
      } catch {}
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Blog Posts', value: stats.posts, href: '/admin/blog', color: 'bg-blue-600' },
    { label: 'Chat Sessions', value: stats.sessions, href: '/admin/chat', color: 'bg-green-600' },
    { label: 'Uploaded Images', value: stats.images, href: '/admin/images', color: 'bg-purple-600' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{card.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/admin/blog"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100"
          >
            <span className="text-xl">✎</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage Blog</p>
              <p className="text-xs text-gray-500">Create and edit blog posts</p>
            </div>
          </a>
          <a
            href="/admin/chat"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100"
          >
            <span className="text-xl">☰</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Chat Support</p>
              <p className="text-xs text-gray-500">Respond to visitor inquiries</p>
            </div>
          </a>
          <a
            href="/admin/images"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors border border-gray-100"
          >
            <span className="text-xl">▣</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Image Gallery</p>
              <p className="text-xs text-gray-500">Upload and manage images</p>
            </div>
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <span className="text-xl">◉</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">View Site</p>
              <p className="text-xs text-gray-500">Open public website</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
