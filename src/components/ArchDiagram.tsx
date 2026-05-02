// Custom MDX component: <ArchDiagram /> — plugin architecture block diagram

export function ArchDiagram() {
  return (
    <div className="my-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-5 not-prose">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
        Plugin Architecture
      </p>
      <div className="flex flex-wrap items-stretch gap-3">
        {/* Host side */}
        <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 p-4 flex flex-col gap-2 min-w-[160px]">
          <p className="text-xs text-violet-700 dark:text-violet-300 font-semibold mb-1">Your Application (host)</p>
          <div className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono">
            PluginHostLauncher
          </div>
          <div className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono">
            PluginHostInterface
          </div>
        </div>

        {/* Arrows */}
        <div className="flex flex-col items-center justify-center gap-1.5 px-1 min-w-[80px]">
          <div className="flex items-center gap-1 text-blue-500 text-xs font-mono">
            <div className="h-px w-5 bg-blue-400" />
            <span>launch</span>
            <span>▶</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
            <span>◀</span>
            <span>IPC</span>
            <div className="h-px w-5 bg-emerald-400" />
            <span>▶</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight mt-1">
            shared mem
            <br />
            &lt; 2 ms
          </p>
        </div>

        {/* Plugin side */}
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 p-4 flex flex-col gap-2 min-w-[190px] flex-1">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">VisionLab.exe (plugin process)</p>
          <div className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono">
            Qt UI + Algorithm Engine
          </div>
          <div className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            Circle · Line · Ellipse · Rect
          </div>
          <div className="rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
            Template Match · PatchCore
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        The plugin runs as a{" "}
        <strong className="text-slate-700 dark:text-slate-200">separate process</strong> — your host
        has no OpenCV, PyTorch, or Qt dependency at all.
      </p>
    </div>
  );
}
