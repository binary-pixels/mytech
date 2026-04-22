"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: 100, label: "Projects Delivered", suffix: "+" },
  { value: 10, label: "Years Experience", suffix: "" },
  { value: 50, label: "Vision Tools Built", suffix: "+" },
  { value: 20, label: "Publications & Talks", suffix: "+" },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, label, suffix = "", delay }: StatItem & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1500, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-slate-800">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} delay={i * 150} />
      ))}
    </div>
  );
}
