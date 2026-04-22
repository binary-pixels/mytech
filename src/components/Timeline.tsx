interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-800" />

      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-cyan-400 bg-slate-900" />

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-400/20 transition-colors">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                  {item.year}
                </span>
                <h3 className="text-slate-100 font-semibold text-sm">{item.title}</h3>
                <span className="text-violet-400 text-xs">@ {item.company}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
