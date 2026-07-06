'use client';

import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { Box3, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';


const MODEL_SRC = '/docs/survey/pool-3D-model-website.glb';

type PoolModelViewerProps = {
  ariaLabel?: string;
};

type PoolSceneProps = {
  progress: number;
  reducedMotion: boolean;
};

const SCROLL_STAGES = [
  {
    eyebrow: '01 / Dollhouse',
    title: 'Start above the pool area.',
    copy: 'A clean bird’s-eye view gives the overall layout first.',
  },
  {
    eyebrow: '02 / Exterior orbit',
    title: 'Circle the outside envelope.',
    copy: 'Scroll slowly to orbit around the pool building and roofline.',
  },
  {
    eyebrow: '03 / Move inside',
    title: 'Push toward the pool interior.',
    copy: 'The camera drops closer so the main pool space becomes the focus.',
  },
  {
    eyebrow: '04 / Pool edge',
    title: 'Glide past the windows.',
    copy: 'Follow the pool edge and look across the primary swimming area.',
  },
  {
    eyebrow: '05 / Inspect',
    title: 'Take control of the model.',
    copy: 'At the end, orbit, zoom and inspect the scan manually.',
  },
];

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function PoolModel({ onReady }: { onReady: (bounds: Box3) => void }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_SRC);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    const bounds = new Box3().setFromObject(groupRef.current);
    const center = bounds.getCenter(new Vector3());
    groupRef.current.position.sub(center);

    requestAnimationFrame(() => {
      if (groupRef.current) {
        onReady(new Box3().setFromObject(groupRef.current));
      }
    });
  }, [onReady, scene]);

  return <primitive ref={groupRef} object={scene} dispose={null} />;
}

function PoolScene({ progress, reducedMotion }: PoolSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [bounds, setBounds] = useState<Box3 | null>(null);

  const radius = useMemo(() => {
    if (!bounds) {
      return 10;
    }
    return Math.max(bounds.getSize(new Vector3()).length() * 0.42, 6);
  }, [bounds]);

  const targetBase = useMemo(() => {
    if (!bounds) {
      return new Vector3(0, 0, 0);
    }
    const center = bounds.getCenter(new Vector3());
    center.y += bounds.getSize(new Vector3()).y * 0.08;
    return center;
  }, [bounds]);

  useFrame(({ camera }) => {
    const controls = controlsRef.current;

    if (reducedMotion || progress >= 0.96) {
      controls?.update();
      return;
    }

    const stage = Math.min(Math.floor(progress * 4), 3);
    const local = smoothstep(progress * 4 - stage);
    const keyframes = [
      {
        yaw: -0.55,
        height: 1.95,
        distance: 1.45,
        targetX: 0,
        targetY: 0.02,
        targetZ: 0,
      },
      {
        yaw: 1.7,
        height: 1.05,
        distance: 1.35,
        targetX: 0.05,
        targetY: 0.05,
        targetZ: 0,
      },
      {
        yaw: 2.75,
        height: 0.48,
        distance: 0.82,
        targetX: 0.1,
        targetY: 0.08,
        targetZ: -0.08,
      },
      {
        yaw: 3.65,
        height: 0.34,
        distance: 0.58,
        targetX: -0.2,
        targetY: 0.04,
        targetZ: -0.18,
      },
      {
        yaw: 4.25,
        height: 0.55,
        distance: 0.95,
        targetX: 0,
        targetY: 0.06,
        targetZ: 0,
      },
    ];

    const from = keyframes[stage];
    const to = keyframes[stage + 1];
    const yaw = mix(from.yaw, to.yaw, local);
    const distance = radius * mix(from.distance, to.distance, local);
    const height = radius * mix(from.height, to.height, local);
    const target = targetBase.clone().add(
      new Vector3(
        radius * mix(from.targetX, to.targetX, local),
        radius * mix(from.targetY, to.targetY, local),
        radius * mix(from.targetZ, to.targetZ, local),
      ),
    );

    const cameraPosition = new Vector3(
      target.x + Math.sin(yaw) * distance,
      target.y + height,
      target.z + Math.cos(yaw) * distance,
    );

    camera.position.lerp(cameraPosition, 0.08);
    camera.lookAt(target);
    if (controls) {
      controls.target.lerp(target, 0.08);
      controls.update();
    }
  });

  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[8, 14, 8]} intensity={2.4} />
      <directionalLight position={[-10, 6, -8]} intensity={0.9} color="#9fd5ff" />
      <Suspense fallback={<Html center className="rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white">Loading model…</Html>}>
        <PoolModel onReady={setBounds} />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enabled={reducedMotion || progress >= 0.96}
        enableDamping
        dampingFactor={0.08}
        minDistance={Math.max(radius * 0.2, 2)}
        maxDistance={Math.max(radius * 2.6, 18)}
      />
    </>
  );
}

export default function PoolModelViewer({
  ariaLabel = 'Scroll-controlled 3D model of the James Square pool area',
}: PoolModelViewerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      setProgress(clamp01(scrollable > 0 ? -rect.top / scrollable : 0));
    };
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion]);

  const activeStage = reducedMotion ? SCROLL_STAGES.length - 1 : Math.min(Math.floor(progress * SCROLL_STAGES.length), SCROLL_STAGES.length - 1);

  return (
    <section ref={wrapperRef} aria-labelledby="pool-model-heading" className="relative min-h-[520vh]">
      <div className="sticky top-0 min-h-screen overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-sky-950/20 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.3),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(2,6,23,0.85))]" />
        <Canvas
          aria-label={ariaLabel}
          role="img"
          camera={{ position: [8, 12, 8], fov: 42, near: 0.05, far: 500 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          className="min-h-screen"
        >
          <PoolScene progress={progress} reducedMotion={reducedMotion} />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-white shadow-2xl backdrop-blur-md sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{SCROLL_STAGES[activeStage].eyebrow}</p>
            <h2 id="pool-model-heading" className="mt-2 text-2xl font-bold sm:text-3xl">{SCROLL_STAGES[activeStage].title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">{reducedMotion ? 'Reduced motion is on, so the model loads directly in interactive mode.' : SCROLL_STAGES[activeStage].copy}</p>
            <p className="mt-3 text-xs font-semibold text-slate-300">{progress >= 0.96 || reducedMotion ? 'Drag to orbit. Scroll or pinch to zoom.' : 'Scroll to guide the camera.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(MODEL_SRC);
