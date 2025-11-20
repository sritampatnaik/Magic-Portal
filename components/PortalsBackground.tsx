'use client';

import { useEffect, useRef } from 'react';

type PortalsBackgroundProps = {
  className?: string;
  portalCount?: number;
  audioLevel?: number;
};

type Portal = {
  radius: number;
  thickness: number;
  speed: number;
  offset: number;
  baseScaleAmplitude: number;
  baseOpacityAmplitude: number;
  baseOpacity: number;
  wobble: number;
  color: string;
};

const PALETTE = ['#7dd3fc', '#c084fc', '#f472b6', '#fcd34d', '#8b5cf6', '#67e8f9'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function PortalsBackground({
  className = '',
  portalCount = 6,
  audioLevel = 0,
}: PortalsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, strength: 0 });
  const audioRef = useRef(audioLevel);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    audioRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const portals: Portal[] = Array.from({ length: portalCount }, (_, index) => {
      const t = (index + 1) / portalCount;
      return {
        radius: 160 + t * 360,
        thickness: 1.5 + t * 4,
        speed: 0.3 + t * 0.35,
        offset: Math.random() * Math.PI * 2,
        baseScaleAmplitude: 0.03 + t * 0.04,
        baseOpacityAmplitude: 0.08 + (1 - t) * 0.08,
        baseOpacity: 0.12 + (1 - t) * 0.25,
        wobble: 0.15 + t * 0.45,
        color: PALETTE[index % PALETTE.length],
      };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
    };

    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / window.innerWidth;
      pointerRef.current.y = event.clientY / window.innerHeight;
      pointerRef.current.strength = 1;
    };

    const handlePointerLeave = () => {
      pointerRef.current.strength = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const drawPortal = (portal: Portal, time: number, pointerInfluence: number, audioInfluence: number) => {
      const { width, height } = sizeRef.current;
      const timeOffset = time * 0.001 * portal.speed + portal.offset;

      const scaleAmplitude =
        portal.baseScaleAmplitude + pointerInfluence * 0.06 + audioInfluence * 0.08;
      const opacityAmplitude =
        portal.baseOpacityAmplitude + pointerInfluence * 0.1 + audioInfluence * 0.12;

      const scale = 1 + Math.sin(timeOffset) * scaleAmplitude;
      const opacity = clamp(
        portal.baseOpacity + Math.cos(timeOffset) * opacityAmplitude,
        0.05,
        0.9,
      );

      ctx.save();

      ctx.translate(width / 2, height / 2);
      ctx.rotate((pointerRef.current.x - 0.5) * portal.wobble * pointerInfluence);
      ctx.scale(
        scale + (pointerRef.current.x - 0.5) * pointerInfluence * 0.04,
        scale + (pointerRef.current.y - 0.5) * pointerInfluence * 0.04,
      );

      ctx.beginPath();
      ctx.strokeStyle = portal.color;
      ctx.lineWidth = portal.thickness;
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = 40;
      ctx.shadowColor = portal.color;
      ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
      ctx.stroke();

      // draw sparkles
      const sparkleCount = 6;
      for (let i = 0; i < sparkleCount; i += 1) {
        const angle = (i / sparkleCount) * Math.PI * 2 + timeOffset * 0.6;
        const dist = portal.radius * (0.7 + ((i % 3) * 0.08));
        const sparkleX = Math.cos(angle) * dist;
        const sparkleY = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.fillStyle = portal.color;
        ctx.globalAlpha = opacity * 0.8;
        ctx.arc(sparkleX, sparkleY, 2 + Math.sin(timeOffset + i) * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      const { width, height, dpr } = sizeRef.current;
      if (!width || !height) {
        raf = requestAnimationFrame(animate);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const pointerInfluence = pointerRef.current.strength;
      pointerRef.current.strength = Math.max(pointerRef.current.strength * 0.96 - 0.001, 0);

      const audioInfluence = clamp(audioRef.current, 0, 1);

      portals.forEach((portal) => drawPortal(portal, time, pointerInfluence, audioInfluence));

      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [portalCount]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(5,8,25,0.35),_rgba(2,3,10,0.85))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/30 to-transparent" />
    </div>
  );
}


