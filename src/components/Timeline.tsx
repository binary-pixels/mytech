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
      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />

            <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-sm transition-colors">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.year}
                </span>
                <h3 className="text-slate-900 font-semibold text-sm">{item.title}</h3>
                <span className="text-violet-600 text-xs">@ {item.company}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
