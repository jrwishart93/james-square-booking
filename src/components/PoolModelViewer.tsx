'use client';

import { useEffect, useRef, useState } from 'react';

const MIN_DISTANCE = 3.5;
const MAX_DISTANCE = 28;
const START_DISTANCE = 13;
const START_YAW = -35;
const START_PITCH = -38;

type PlayCanvasModule = typeof import('playcanvas');
type PlayCanvasEntity = import('playcanvas').Entity;
type PlayCanvasMeshInstance = import('playcanvas').MeshInstance;
type PlayCanvasRenderComponent = import('playcanvas').RenderComponent;
type GlbContainerResource = {
  instantiateRenderEntity: (options?: { castShadows?: boolean }) => PlayCanvasEntity;
};

type PoolModelViewerSize = 'hero' | 'standard' | 'compact';

const SUPPORTED_MODEL_EXTENSIONS = new Set(['glb', 'gltf']);
const isDevelopment = process.env.NODE_ENV === 'development';

const getModelExtension = (modelSrc: string) => modelSrc.split('?')[0]?.split('#')[0]?.split('.').pop()?.toLowerCase() ?? '';

const checkModelUrl = async (modelSrc: string) => {
  const headResponse = await fetch(modelSrc, { method: 'HEAD', cache: 'no-store' });

  if (headResponse.ok) {
    return;
  }

  if (headResponse.status === 405 || headResponse.status === 501) {
    const getResponse = await fetch(modelSrc, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    });

    if (getResponse.ok) {
      return;
    }

    console.error('Pool model URL check failed:', { url: modelSrc, status: getResponse.status });
    throw new Error(`Model URL check failed for ${modelSrc} with status ${getResponse.status}`);
  }

  console.error('Pool model URL check failed:', { url: modelSrc, status: headResponse.status });
  throw new Error(`Model URL check failed for ${modelSrc} with status ${headResponse.status}`);
};

const viewerHeightClasses: Record<PoolModelViewerSize, string> = {
  hero: 'h-[360px] sm:h-[520px] lg:h-[680px]',
  standard: 'h-[320px] sm:h-[440px] lg:h-[560px]',
  compact: 'h-[280px] sm:h-[380px] lg:h-[480px]',
};

type PoolModelViewerProps = {
  ariaLabel?: string;
  autoSpin?: boolean;
  autoSpinSpeed?: number;
  introMotion?: boolean;
  loadingLabel?: string;
  modelName?: string;
  modelSrc: string;
  size?: PoolModelViewerSize;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function PoolModelViewer({
  ariaLabel = 'Interactive PlayCanvas 3D model of the James Square pool area',
  autoSpin = false,
  autoSpinSpeed = 2,
  introMotion = true,
  loadingLabel = 'Loading PlayCanvas pool model…',
  modelName = 'James Square pool model',
  modelSrc,
  size = 'hero',
}: PoolModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let isDisposed = false;
    let cleanup: (() => void) | undefined;

    setLoadState('loading');
    setErrorMessage(null);

    const setup = async () => {
      try {
        const modelExtension = getModelExtension(modelSrc);

        if (!SUPPORTED_MODEL_EXTENSIONS.has(modelExtension)) {
          throw new Error(`Unsupported 3D model file extension for ${modelSrc}. Expected .glb or .gltf.`);
        }

        await checkModelUrl(modelSrc);

        const pc: PlayCanvasModule = await import('playcanvas');

        if (isDisposed) {
          return;
        }

        const app = new pc.Application(canvas, {
          mouse: new pc.Mouse(canvas),
          touch: new pc.TouchDevice(canvas),
          keyboard: new pc.Keyboard(window),
          graphicsDeviceOptions: {
            alpha: false,
            antialias: true,
            powerPreference: 'high-performance',
          },
        });

        cleanup = () => {
          app.destroy();
        };

        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.scene.ambientLight = new pc.Color(0.55, 0.62, 0.68);
        app.scene.exposure = 1.28;
        (app.scene as unknown as { toneMapping: number }).toneMapping = pc.TONEMAP_ACES;
        app.start();

        const camera = new pc.Entity('Pool camera');
        camera.addComponent('camera', {
          clearColor: new pc.Color(0.05, 0.06, 0.08),
          farClip: 1000,
          fov: 42,
          nearClip: 0.08,
        });
        app.root.addChild(camera);

        const keyLight = new pc.Entity('Main soft light');
        keyLight.addComponent('light', {
          type: 'directional',
          color: new pc.Color(1, 0.96, 0.88),
          intensity: 3.2,
          castShadows: true,
          shadowDistance: 35,
        });
        keyLight.setEulerAngles(45, 35, 0);
        app.root.addChild(keyLight);

        const fillLight = new pc.Entity('Fill light');
        fillLight.addComponent('light', {
          type: 'directional',
          color: new pc.Color(0.55, 0.7, 1),
          intensity: 1.35,
        });
        fillLight.setEulerAngles(20, -135, 0);
        app.root.addChild(fillLight);

        const asset = new pc.Asset(modelName, 'container', { url: modelSrc });
        app.assets.add(asset);

        let isReady = false;
        let autoMotionEnabled = autoSpin && introMotion;

        const state = {
          distance: START_DISTANCE,
          yaw: START_YAW,
          pitch: START_PITCH,
          target: new pc.Vec3(0, 1.2, 0),
          minDistance: MIN_DISTANCE,
          maxDistance: MAX_DISTANCE,
          pointerMode: null as 'rotate' | 'pan' | null,
          pointerId: null as number | null,
          lastX: 0,
          lastY: 0,
          pinchDistance: 0,
        };

        const updateCamera = () => {
          state.pitch = clamp(state.pitch, -80, -8);
          state.distance = clamp(state.distance, state.minDistance, state.maxDistance);

          const yaw = state.yaw * pc.math.DEG_TO_RAD;
          const pitch = state.pitch * pc.math.DEG_TO_RAD;
          const horizontal = Math.cos(pitch) * state.distance;
          const position = new pc.Vec3(
            state.target.x + Math.sin(yaw) * horizontal,
            state.target.y + Math.sin(-pitch) * state.distance,
            state.target.z + Math.cos(yaw) * horizontal,
          );

          camera.setPosition(position);
          camera.lookAt(state.target);
        };

        const panCamera = (deltaX: number, deltaY: number) => {
          const scale = state.distance * 0.0017;
          const right = camera.right.clone().mulScalar(-deltaX * scale);
          const up = camera.up.clone().mulScalar(deltaY * scale);
          state.target.add(right).add(up);
          updateCamera();
        };

        const stopAutoMotion = () => {
          autoMotionEnabled = false;
        };

        const onWheel = (event: WheelEvent) => {
          stopAutoMotion();
          event.preventDefault();
          state.distance *= 1 + Math.sign(event.deltaY) * 0.1;
          updateCamera();
        };

        const onPointerDown = (event: PointerEvent) => {
          stopAutoMotion();
          canvas.setPointerCapture(event.pointerId);
          state.pointerId = event.pointerId;
          state.pointerMode = event.button === 1 || event.button === 2 || event.shiftKey ? 'pan' : 'rotate';
          state.lastX = event.clientX;
          state.lastY = event.clientY;
        };

        const onPointerMove = (event: PointerEvent) => {
          if (state.pointerId !== event.pointerId || !state.pointerMode) {
            return;
          }

          const deltaX = event.clientX - state.lastX;
          const deltaY = event.clientY - state.lastY;
          state.lastX = event.clientX;
          state.lastY = event.clientY;

          if (state.pointerMode === 'pan') {
            panCamera(deltaX, deltaY);
          } else {
            state.yaw -= deltaX * 0.35;
            state.pitch -= deltaY * 0.25;
            updateCamera();
          }
        };

        const onPointerUp = (event: PointerEvent) => {
          if (state.pointerId === event.pointerId) {
            state.pointerId = null;
            state.pointerMode = null;
          }
        };

        const onContextMenu = (event: MouseEvent) => event.preventDefault();
        const onKeyDown = () => {
          stopAutoMotion();
        };

        const onUpdate = (deltaTime: number) => {
          if (!isReady || !autoMotionEnabled) {
            return;
          }

          state.yaw += autoSpinSpeed * deltaTime;
          updateCamera();
        };

        app.on('update', onUpdate);

        const onTouchMove = (event: TouchEvent) => {
          stopAutoMotion();
          if (event.touches.length !== 2) {
            state.pinchDistance = 0;
            return;
          }

          event.preventDefault();
          const [first, second] = Array.from(event.touches);
          const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);

          if (state.pinchDistance > 0) {
            state.distance *= state.pinchDistance / distance;
            updateCamera();
          }

          state.pinchDistance = distance;
        };

        canvas.addEventListener('wheel', onWheel, { passive: false });
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointercancel', onPointerUp);
        canvas.addEventListener('contextmenu', onContextMenu);
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('keydown', onKeyDown);

        cleanup = () => {
          canvas.removeEventListener('wheel', onWheel);
          canvas.removeEventListener('pointerdown', onPointerDown);
          canvas.removeEventListener('pointermove', onPointerMove);
          canvas.removeEventListener('pointerup', onPointerUp);
          canvas.removeEventListener('pointercancel', onPointerUp);
          canvas.removeEventListener('contextmenu', onContextMenu);
          canvas.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('keydown', onKeyDown);
          app.off('update', onUpdate);
          app.destroy();
        };

        asset.ready(() => {
          if (isDisposed) {
            return;
          }

          const container = asset.resource as GlbContainerResource;
          const model = container.instantiateRenderEntity({ castShadows: true });
          model.name = modelName;
          app.root.addChild(model);

          const poolWaterMaterial = new pc.StandardMaterial();
          poolWaterMaterial.name = 'Pool water blue reference material';
          poolWaterMaterial.diffuse = new pc.Color(0.02, 0.48, 0.78);
          poolWaterMaterial.emissive = new pc.Color(0, 0.06, 0.09);
          poolWaterMaterial.opacity = 0.78;
          poolWaterMaterial.blendType = pc.BLEND_NORMAL;
          poolWaterMaterial.useMetalness = true;
          poolWaterMaterial.metalness = 0;
          poolWaterMaterial.gloss = 0.85;
          poolWaterMaterial.update();

          const bounds = new pc.BoundingBox();
          let hasBounds = false;
          const renders = model.findComponents('render') as PlayCanvasRenderComponent[];
          renders.forEach((render: PlayCanvasRenderComponent) => {
            render.meshInstances.forEach((meshInstance: PlayCanvasMeshInstance) => {
              const meshName = `${meshInstance.node?.name ?? ''} ${meshInstance.material?.name ?? ''}`.toLowerCase();
              if (meshName.includes('waterbody') || meshName.includes('watervolume')) {
                meshInstance.material = poolWaterMaterial;
              }

              if (!hasBounds) {
                bounds.copy(meshInstance.aabb);
                hasBounds = true;
              } else {
                bounds.add(meshInstance.aabb);
              }
            });
          });

          if (hasBounds) {
            state.target.copy(bounds.center);
            state.target.y += bounds.halfExtents.y * 0.12;
            const radius = bounds.halfExtents.length();
            state.minDistance = Math.max(radius * 0.35, MIN_DISTANCE);
            state.maxDistance = Math.max(radius * 3.5, MAX_DISTANCE);
            state.distance = clamp(radius * 1.55, state.minDistance, state.maxDistance);
            camera.camera!.nearClip = Math.max(radius * 0.004, 0.05);
            camera.camera!.farClip = Math.max(radius * 10, 100);
          }

          updateCamera();
          isReady = true;
          setLoadState('ready');
        });

        asset.on('error', (error: unknown) => {
          console.error('Failed to load pool model:', { url: modelSrc, error });
          setErrorMessage(isDevelopment
            ? `The 3D model could not be loaded from ${modelSrc}. Check that the URL exists and that any referenced .bin or texture files are also available.`
            : 'The 3D model could not be loaded. Please try refreshing the page.'
          );
          setLoadState('error');
        });

        app.assets.load(asset);
        updateCamera();
      } catch (error) {
        console.error('Failed to initialise PlayCanvas:', { url: modelSrc, error });
        setErrorMessage(isDevelopment
          ? `The 3D model could not be loaded from ${modelSrc}. ${error instanceof Error ? error.message : 'Check the browser console for details.'}`
          : 'The 3D model could not be loaded. Please try refreshing the page.'
        );
        setLoadState('error');
      }
    };

    void setup();

    return () => {
      isDisposed = true;
      cleanup?.();
    };
  }, [autoSpin, autoSpinSpeed, introMotion, modelName, modelSrc]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl shadow-sky-950/20">
      <div className={`relative w-full ${viewerHeightClasses[size]}`}>
        <canvas
          ref={canvasRef}
          aria-label={ariaLabel}
          role="img"
          className="h-full w-full touch-none bg-slate-950 outline-none"
        />
        {loadState !== 'ready' ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center text-sm font-semibold text-white">
            {loadState === 'error' ? errorMessage : loadingLabel}
          </div>
        ) : null}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs leading-5 text-slate-200 backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
          Drag to rotate. Scroll or pinch to zoom. Shift-drag, middle-drag, or right-drag to pan.
        </div>
      </div>
    </div>
  );
}
