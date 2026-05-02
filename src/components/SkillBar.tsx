interface SkillBarProps {
  name: string;
  level: number; // 0-100
  color?: "blue" | "violet";
}

export function SkillBar({ name, level, color = "blue" }: SkillBarProps) {
  const barColor = color === "blue" ? "bg-blue-600" : "bg-violet-600";
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-700 font-medium">{name}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
  skills: { name: string; level: number; color?: "blue" | "violet" }[];
}

export function SkillGroup({ title, skills }: SkillGroupProps) {
  return (
    <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <h3 className="text-slate-700 font-semibold mb-5 text-sm uppercase tracking-wider">
        {title}
      </h3>
      {skills.map((s) => (
        <SkillBar key={s.name} {...s} />
      ))}
    </div>
  );
}
