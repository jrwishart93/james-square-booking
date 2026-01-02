"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  totalVotes,
  turnoutFlats,
}: Results3DPieProps) {
  const isDark = theme === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const isSecondary = emphasis === "secondary";
  const resolvedTotal =
    typeof totalVotes === "number" ? totalVotes : data.reduce((sum, item) => sum + item.value, 0);
  const resolvedTurnout = turnoutFlats ?? undefined;

  return (
    <div
      className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-lg dark:bg-slate-900/70 dark:border-white/10 dark:shadow-2xl"
      aria-label={`Vote distribution donut${resolvedTurnout ? `, ${resolvedTurnout} flats` : ""}`}
    >
      <div className="relative h-64 w-full dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] dark:filter dark:brightness-110">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="88%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              cornerRadius={10}
              stroke={isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
              strokeWidth={2}
              isAnimationActive
              animationDuration={1400}
              animationBegin={150}
              label={false}
              labelLine={false}
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
              nameKey="name"
              innerRadius="64%"
              outerRadius="84%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              cornerRadius={10}
              stroke={isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
              strokeWidth={2}
              isAnimationActive
              animationDuration={1400}
              label={false}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                key={`slice-${index}`}
                fill={colors[index % colors.length]}
                style={{
                  filter: isSecondary
                    ? "drop-shadow(0 6px 10px rgba(0,0,0,0.15))"
                    : "drop-shadow(0 6px 10px rgba(0,0,0,0.15))",
                }}
              />
            ))}
          </Pie>

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const { name, value, percentage } = payload[0].payload as {
                  name: string;
                  value: number;
                  percentage: number;
                };
                return (
                  <div className="rounded-xl bg-white/90 backdrop-blur-md px-4 py-2 shadow-lg border border-slate-200 text-sm dark:bg-slate-900/90 dark:border-white/10">
                    <div className="font-semibold text-slate-900 dark:text-white">{name}</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {value} votes • {percentage}%
                    </div>
                  </div>
                );
              }}
            />

            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              className="fill-slate-900 dark:fill-white font-extrabold"
              style={{ fontSize: "48px" }}
            >
              {resolvedTotal.toLocaleString()}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-medium"
              style={{ fontSize: "14px" }}
            >
              Total votes
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="my-3 h-px bg-slate-200/60 dark:bg-white/10" />

      <div className="mt-4 space-y-1.5">
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
