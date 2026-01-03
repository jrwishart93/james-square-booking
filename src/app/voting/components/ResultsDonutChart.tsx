"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type PieDatum = {
  name: string;
  value: number;
};

type Props = {
  data: PieDatum[];
};

const COLORS = ["#22d3ee", "#6366f1", "#a78bfa"];

export default function ResultsDonutChart({ data }: Props) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <div className="space-y-4">
      <div className="relative h-[260px] w-full rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-md dark:bg-white/5 dark:border-white/10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="80%"
              paddingAngle={3}
              cornerRadius={10}
              isAnimationActive
              animationDuration={1200}
              animationBegin={200}
              animationEasing="ease-out"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(148,163,184,0.4)",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{total}</span>
          <span className="text-sm text-slate-500 dark:text-slate-300">Total votes</span>
        </div>
      </div>

      <ul className="space-y-2 text-sm">
        {data.map((item, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
