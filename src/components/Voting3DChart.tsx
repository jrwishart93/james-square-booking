"use client";

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Option } from "@/app/voting/types";
import { useRef } from "react";
import * as THREE from "three";

export type ResultStat = { option: Option; count: number; percentage: number };

interface Voting3DChartProps {
  data: ResultStat[];
  totalVotes: number;
  paused: boolean;
  palette: string[];
  isMobile: boolean;
}

export default function Voting3DChart({ data, totalVotes, paused, palette, isMobile }: Voting3DChartProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredIndex = useRef<number | null>(null);
  const barRefs = useRef<THREE.Mesh[]>([]);
  const labelRefs = useRef<THREE.Group[]>([]);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const radius = isMobile ? 3.2 : 4.5;
  const baseHeight = isMobile ? 0.3 : 0.4;
  const segments = isMobile ? 12 : 22;
  const glowIntensity = isMobile ? 0.35 : 0.55;
  const rotationSpeed = (2 * Math.PI) / 18; // ~18s per revolution

  useFrame((_, delta) => {
    if (groupRef.current && !paused) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }

    data.forEach((entry, index) => {
      const bar = barRefs.current[index];
      const label = labelRefs.current[index];
      if (!bar) return;

      const target = Math.max(baseHeight, (entry.count / maxCount) * 2.2);
      const nextScale = THREE.MathUtils.damp(bar.scale.y || 0.01, target, 5, delta);
      bar.scale.y = nextScale;
      bar.position.y = nextScale / 2;

      if (label) {
        label.position.y = nextScale + 0.4;
      }
    });
  });

  return (
    <Canvas
      camera={{ position: [0, 4.5, 8], fov: 40 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050814");
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      }}
      frameloop={paused ? "demand" : "always"}
    >
      <ambientLight intensity={1.1} color="#8dd8ff" />
      <pointLight position={[4, 6, 4]} intensity={0.6} color="#8b5cf6" />
      <group ref={groupRef} position={[0, -0.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <circleGeometry args={[radius + 1, 48]} />
          <meshStandardMaterial color="#0b1328" emissive="#1f2a4d" emissiveIntensity={0.2} />
        </mesh>

        {data.map(({ option, count, percentage }, index) => {
          const pct = Number.isFinite(percentage) ? percentage : 0;
          const angle = (index / data.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const color = palette[index % palette.length];
          const isHovered = hoveredIndex.current === index;
          const scale = isHovered ? 1.12 : 1;

          return (
            <group key={option.id} position={[x, 0, z]} rotation={[0, angle + Math.PI / 2, 0]}>
              <mesh
                onPointerOver={() => {
                  hoveredIndex.current = index;
                }}
                onPointerOut={() => {
                  hoveredIndex.current = null;
                }}
                position={[0, baseHeight / 2, 0]}
                scale={[scale, 1, scale]}
                ref={(node) => {
                  if (node) {
                    barRefs.current[index] = node;
                    node.scale.y = 0.01;
                    node.position.y = 0.01 / 2;
                  }
                }}
              >
                <cylinderGeometry args={[0.45, 0.45, 1, segments, 1, false]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={glowIntensity + (isHovered ? 0.25 : 0)}
                  metalness={0.35}
                  roughness={0.35}
                />
              </mesh>
              <group
                ref={(node) => {
                  if (node) labelRefs.current[index] = node;
                }}
                position={[0, baseHeight + 0.4, 0]}
              >
                <Html center>
                  <div className="rounded-lg border border-cyan-500/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-cyan-50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span>{option.label}</span>
                      <span className="text-cyan-200/90 font-mono">{count}</span>
                    </div>
                    <div className="text-[10px] text-cyan-100/70">
                      {pct}% of {totalVotes || 0}
                    </div>
                  </div>
                </Html>
              </group>
            </group>
          );
        })}
      </group>
    </Canvas>
  );
}
