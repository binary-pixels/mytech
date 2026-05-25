'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecked(true);
      return;
    }

    const agent = sessionStorage.getItem('agent');
    if (!agent) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  function handleSignOut() {
    sessionStorage.removeItem('agent');
    window.location.href = '/admin/login';
  }

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '◉' },
    { href: '/admin/blog', label: 'Blog', icon: '✎' },
    { href: '/admin/chat', label: 'Chat', icon: '☰' },
    { href: '/admin/images', label: 'Images', icon: '▣' },
  ];

  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      {!isLoginPage && (
        <header className="bg-gray-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg">👁</span>
              <span className="font-semibold text-sm hidden sm:inline">Admin</span>
            </div>
            <nav className="flex gap-1.5 sm:gap-2">
              {navLinks.map(({ href, label, icon }) => {
                const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                return (
                  <a
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">{icon}</span>
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Sign out
            </button>
            <a
              href="/"
              target="_blank"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Website →
            </a>
          </div>
        </header>
      )}
      {children}
    </>
  );
}
