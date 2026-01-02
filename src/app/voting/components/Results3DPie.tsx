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
};

const LIGHT_COLORS = ["#22d3ee", "#6366f1", "#a78bfa", "#06b6d4", "#818cf8"];
const DARK_COLORS = ["#67e8f9", "#818cf8", "#c4b5fd", "#22d3ee", "#a5b4fc"];

export default function Results3DPie({ data, theme = "light" }: Results3DPieProps) {
  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={52}
            outerRadius={82}
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
            innerRadius={48}
            outerRadius={78}
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
                  filter:
                    theme === "dark"
                      ? "drop-shadow(0 12px 22px rgba(0,0,0,0.55))"
                      : "drop-shadow(0 10px 18px rgba(0,0,0,0.25))",
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
    </div>
  );
}
