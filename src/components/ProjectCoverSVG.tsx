/** Inline SVG covers for Case Study cards — one per slug */

function MesIntegrationCover() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <rect width="480" height="270" fill="#0f172a" />
      {/* Grid dots */}
      {Array.from({ length: 10 }, (_, col) =>
        Array.from({ length: 6 }, (_, row) => (
          <circle key={`${col}-${row}`} cx={col * 53 + 27} cy={row * 45 + 22} r="1.2" fill="#334155" />
        ))
      )}

      {/* Host box */}
      <rect x="30" y="90" width="140" height="90" rx="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
      <text x="100" y="120" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontFamily="monospace" fontWeight="bold">HOST APP</text>
      <rect x="50" y="128" width="100" height="18" rx="4" fill="#312e81" />
      <text x="100" y="141" textAnchor="middle" fill="#c7d2fe" fontSize="8" fontFamily="monospace">MES Controller</text>
      <rect x="50" y="150" width="100" height="16" rx="4" fill="#1e1b4b" />
      <text x="100" y="162" textAnchor="middle" fill="#818cf8" fontSize="7.5" fontFamily="monospace">AlgoAPI.h  (C API)</text>

      {/* Arrow + label */}
      <line x1="172" y1="135" x2="308" y2="135" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 3" />
      <polygon points="308,130 318,135 308,140" fill="#3b82f6" />
      <polygon points="172,130 162,135 172,140" fill="#6366f1" />
      <text x="240" y="122" textAnchor="middle" fill="#60a5fa" fontSize="7.5" fontFamily="monospace">launch / IPC</text>
      <text x="240" y="153" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">Shared Memory</text>

      {/* Plugin box */}
      <rect x="310" y="90" width="140" height="90" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="380" y="120" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace" fontWeight="bold">VISIONLAB.EXE</text>
      <rect x="328" y="128" width="104" height="18" rx="4" fill="#172554" />
      <text x="380" y="141" textAnchor="middle" fill="#bfdbfe" fontSize="8" fontFamily="monospace">Plugin Process</text>
      <rect x="328" y="150" width="104" height="16" rx="4" fill="#0f2040" />
      <text x="380" y="162" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontFamily="monospace">Qt + Algorithm Engine</text>

      {/* Bottom label */}
      <text x="240" y="210" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="monospace">Zero host-side OpenCV / PyTorch dependency</text>
    </svg>
  );
}

function SurfaceDefectCover() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background - metal texture */}
      <rect width="480" height="270" fill="#111827" />
      {/* Metal grid */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={(i + 1) * 27} x2="480" y2={(i + 1) * 27} stroke="#1f2937" strokeWidth="1" />
      ))}
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 27} y1="0" x2={(i + 1) * 27} y2="270" stroke="#1f2937" strokeWidth="1" />
      ))}

      {/* Normal region patches (green-ish) */}
      {[[60,80],[160,60],[280,100],[380,70],[420,150],[60,180],[160,170],[320,190]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="40" height="30" rx="3" fill="#14532d" fillOpacity="0.4" />
      ))}

      {/* Anomaly blobs */}
      <ellipse cx="230" cy="130" rx="38" ry="26" fill="#ef4444" fillOpacity="0.25" />
      <ellipse cx="230" cy="130" rx="24" ry="16" fill="#ef4444" fillOpacity="0.35" />
      <ellipse cx="230" cy="130" rx="12" ry="8" fill="#fca5a5" fillOpacity="0.6" />
      <ellipse cx="350" cy="170" rx="22" ry="16" fill="#f97316" fillOpacity="0.25" />
      <ellipse cx="350" cy="170" rx="12" ry="9" fill="#fb923c" fillOpacity="0.45" />

      {/* Score bars */}
      <rect x="30" y="30" width="90" height="14" rx="3" fill="#1f2937" />
      <rect x="30" y="30" width="76" height="14" rx="3" fill="#16a34a" />
      <text x="126" y="41" fill="#4ade80" fontSize="8" fontFamily="monospace">Normal 0.12</text>

      <rect x="190" y="100" width="80" height="14" rx="3" fill="#1f2937" />
      <rect x="190" y="100" width="72" height="14" rx="3" fill="#dc2626" />
      <text x="276" y="111" fill="#fca5a5" fontSize="8" fontFamily="monospace">Defect 0.89</text>

      {/* Label */}
      <rect x="0" y="230" width="480" height="40" fill="#0f172a" fillOpacity="0.8" />
      <text x="240" y="252" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">DINOv2 + PatchCore  ·  8 normal images  ·  zero defect labels</text>
    </svg>
  );
}

function WaferInspectionCover() {
  const rows = 5;
  const cols = 7;
  const ox = 240, oy = 135, r = 115;
  const holes: [number, number][] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 120 + col * 40;
      const y = 80 + row * 38;
      const dx = x - ox, dy = y - oy;
      if (dx * dx + dy * dy < r * r) holes.push([x, y]);
    }
  }
  const target: [number, number] = [240, 118];

  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <rect width="480" height="270" fill="#0a0f1e" />
      {/* Wafer circle */}
      <circle cx={ox} cy={oy} r={r} fill="#0f172a" stroke="#1e3a5f" strokeWidth="1.5" />
      <circle cx={ox} cy={oy} r={r - 8} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

      {/* Via holes */}
      {holes.map(([x, y], i) => {
        const isTarget = x === target[0] && y === target[1];
        if (isTarget) return null;
        return (
          <circle key={i} cx={x} cy={y} r="7" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
        );
      })}

      {/* Target via-hole with fit circle */}
      <circle cx={target[0]} cy={target[1]} r="7" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
      {/* RANSAC fit circle */}
      <circle cx={target[0]} cy={target[1]} r="7.3" fill="none" stroke="#3b82f6" strokeWidth="1.5"
        strokeDasharray="3 2" />
      {/* Sub-pixel annotation */}
      <line x1={target[0]} y1={target[1]} x2={target[0] + 28} y2={target[1] - 22} stroke="#60a5fa" strokeWidth="1" />
      <rect x={target[0] + 28} y={target[1] - 36} width="72" height="16" rx="3" fill="#172554" />
      <text x={target[0] + 64} y={target[1] - 24} textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontFamily="monospace">r = 7.08 px</text>
      <line x1={target[0]} y1={target[1]} x2={target[0] - 30} y2={target[1] + 20} stroke="#60a5fa" strokeWidth="1" />
      <rect x={target[0] - 100} y={target[1] + 18} width="70" height="16" rx="3" fill="#172554" />
      <text x={target[0] - 65} y={target[1] + 30} textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontFamily="monospace">err &lt; 0.05 px</text>

      {/* Legend */}
      <rect x="0" y="236" width="480" height="34" fill="#070d1a" fillOpacity="0.9" />
      <circle cx="26" cy="253" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="36" y="257" fill="#60a5fa" fontSize="8" fontFamily="monospace">RANSAC fit</text>
      <circle cx="130" cy="253" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
      <text x="140" y="257" fill="#94a3b8" fontSize="8" fontFamily="monospace">Via-hole</text>
      <text x="310" y="257" fill="#475569" fontSize="8" fontFamily="monospace">Sub-pixel accuracy &lt; 0.1 px</text>
    </svg>
  );
}

const coverMap: Record<string, React.FC> = {
  "plugin-sdk-integration": MesIntegrationCover,
  "surface-defect-patchcore": SurfaceDefectCover,
  "wafer-inspection": WaferInspectionCover,
};

export default function ProjectCoverSVG({ slug }: { slug: string }) {
  const Cover = coverMap[slug];
  if (!Cover) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl opacity-10">👁</span>
      </div>
    );
  }
  return <Cover />;
}
