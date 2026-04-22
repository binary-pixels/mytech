interface SkillBarProps {
  name: string;
  level: number; // 0-100
  color?: "cyan" | "violet";
}

export function SkillBar({ name, level, color = "cyan" }: SkillBarProps) {
  const barColor = color === "cyan" ? "bg-cyan-400" : "bg-violet-400";
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

interface SkillGroupProps {
  title: string;
  skills: { name: string; level: number; color?: "cyan" | "violet" }[];
}

export function SkillGroup({ title, skills }: SkillGroupProps) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
      <h3 className="text-slate-300 font-semibold mb-5 text-sm uppercase tracking-wider">
        {title}
      </h3>
      {skills.map((s) => (
        <SkillBar key={s.name} {...s} />
      ))}
    </div>
  );
}
