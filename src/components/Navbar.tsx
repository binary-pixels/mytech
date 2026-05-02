"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/tools", label: "Algorithms" },
  { href: "/projects", label: "Case Studies" },
  { href: "/blog", label: "Knowledge Base" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-slate-900 border-b",
        scrolled ? "shadow-md border-transparent" : "shadow-sm border-gray-200 dark:border-slate-700"
      )}
    >
      <nav className="w-full px-8 h-[72px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">👁</span>
          <span className="gradient-text font-extrabold text-xl tracking-tight">VisionLab</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {mainLinks.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "px-4 py-2 text-[15px] font-bold transition-colors duration-150",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

          {/* Right: CTA + Theme Toggle + Search */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/tools"
              className="px-5 py-2.5 rounded bg-blue-600 text-white text-[15px] font-bold hover:bg-blue-700 transition-colors"
            >
              Get SDK
            </Link>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-[42px] h-[42px] flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mounted && theme === "dark" ? <Sun size={18} strokeWidth={2} /> : mounted ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
            </button>
          </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-700 dark:text-slate-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <ul className="px-6 py-3 flex flex-col gap-1">
            {mainLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-bold rounded",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-1 flex items-center justify-between">
              <Link
                href="/tools"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400"
              >
                Get SDK →
              </Link>
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="mr-4 w-[38px] h-[38px] flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
