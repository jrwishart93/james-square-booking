"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { NameType, ValueType, Payload } from "recharts/types/component/DefaultTooltipContent";

type PieDatum = {
  name: string;
  value: number;
  percentage: number;
};

type Results3DPieProps = {
  data: PieDatum[];
  theme?: "light" | "dark";
  emphasis?: "primary" | "secondary";
  totalVotes?: number;
  turnoutFlats?: number;
  enableParallax?: boolean;
};

const LIGHT_COLORS = ["#22d3ee", "#6366f1", "#a78bfa", "#06b6d4", "#818cf8"];
const DARK_COLORS = ["#67e8f9", "#818cf8", "#c4b5fd", "#22d3ee", "#a5b4fc"];

export default function Results3DPie({
  data,
  theme = "light",
  emphasis = "secondary",
}: Results3DPieProps) {
  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const isSecondary = emphasis === "secondary";

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={isSecondary ? 46 : 52}
            outerRadius={isSecondary ? 72 : 82}
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
            isAnimationActive
            animationDuration={900}
            animationBegin={150}
          >
            {data.map((_, index) => (
              <Cell
                key={`shadow-${index}`}
                fill={theme === "dark" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.18)"}
                style={{
                  transform: "translate(3px, 6px)",
                }}
              />
            ))}
          </Pie>

          <Pie
            data={data}
            dataKey="value"
            innerRadius={isSecondary ? 42 : 48}
            outerRadius={isSecondary ? 68 : 78}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((_, index) => (
              <Cell
                key={`slice-${index}`}
                fill={colors[index % colors.length]}
                style={{
                  filter: isSecondary
                    ? "drop-shadow(0 6px 10px rgba(0,0,0,0.18))"
                    : theme === "dark"
                      ? "drop-shadow(0 12px 22px rgba(0,0,0,0.35))"
                      : "drop-shadow(0 12px 22px rgba(0,0,0,0.25))",
                }}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: ValueType, name: NameType, props?: Payload<ValueType, NameType>) => {
              const votes = Number(value ?? 0);
              const pct =
                typeof props?.payload?.percentage === "number" ? props.payload.percentage : 0;
              return [`${votes} votes (${pct}%)`, String(name ?? "")];
            }}
            contentStyle={{
              background: theme === "dark" ? "rgba(2,6,23,0.95)" : "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "none",
              boxShadow:
                theme === "dark"
                  ? "0 20px 60px rgba(0,0,0,0.7)"
                  : "0 20px 60px rgba(15,23,42,0.25)",
              color: theme === "dark" ? "#e5e7eb" : "#0f172a",
            }}
            itemStyle={{
              color: theme === "dark" ? "#67e8f9" : "#0ea5e9",
              fontWeight: 600,
            }}
            labelStyle={{
              color: theme === "dark" ? "#cbd5f5" : "#334155",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="my-3 h-px bg-slate-200 dark:bg-white/10" />

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate text-slate-700 dark:text-slate-200">{item.name}</span>
            </div>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              {item.value} • {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
