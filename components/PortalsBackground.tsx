'use client';

import { useEffect, useRef } from 'react';

type PortalsBackgroundProps = {
  className?: string;
  portalCount?: number;
  audioLevel?: number;
};

type RGB = { r: number; g: number; b: number };

type Portal = {
  radius: number;
  speed: number;
  offset: number;
  axisRatio: number;
  rotation: number;
  baseScaleAmplitude: number;
  baseOpacityAmplitude: number;
  baseOpacity: number;
  glow: number;
  color: RGB;
};

const BLUE_PALETTE = ['#0317d8', '#0526f0', '#0a3cff', '#1c58ff', '#3075ff', '#5a9cff'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const hexToRgb = (hex: string): RGB => {
  const sanitized = hex.replace('#', '');
  const value = parseInt(sanitized.length === 3 ? sanitized.repeat(2) : sanitized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgba = (color: RGB, alpha: number) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

export function PortalsBackground({
  className = '',
  portalCount = 6,
  audioLevel = 0,
}: PortalsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      const color = hexToRgb(BLUE_PALETTE[index % BLUE_PALETTE.length]);
      return {
        radius: 140 + t * 360,
        speed: 0.25 + t * 0.3,
        offset: Math.random() * Math.PI * 2,
        axisRatio: 0.45 + (1 - t) * 0.35,
        rotation: -0.25 + t * 0.2,
        baseScaleAmplitude: 0.02 + t * 0.05,
        baseOpacityAmplitude: 0.05 + (1 - t) * 0.05,
        baseOpacity: 0.25 + (1 - t) * 0.18,
        glow: 60 + t * 90,
        color,
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

    const drawPortal = (
      portal: Portal,
      time: number,
      audioInfluence: number,
    ) => {
      const { width, height } = sizeRef.current;
      const timeOffset = time * 0.001 * portal.speed + portal.offset;

      const scaleAmplitude =
        portal.baseScaleAmplitude + audioInfluence * 0.08;
      const opacityAmplitude =
        portal.baseOpacityAmplitude + audioInfluence * 0.12;

      const baseScale = 1 + Math.sin(timeOffset) * scaleAmplitude;
      const axisRatio = portal.axisRatio + Math.cos(timeOffset) * 0.02;

      const scaleX = baseScale;
      const scaleY = baseScale * clamp(axisRatio, 0.2, 1.1);

      const opacity = clamp(
        portal.baseOpacity + Math.cos(timeOffset) * opacityAmplitude,
        0.08,
        0.95,
      );

      const centerX = width * 0.65;
      const centerY = height * 0.35;

      ctx.save();
      ctx.translate(centerX, centerY);

      const rotation = portal.rotation + Math.sin(timeOffset) * 0.04;

      ctx.rotate(rotation);
      ctx.scale(scaleX, scaleY);

      const gradient = ctx.createRadialGradient(
        0,
        0,
        portal.radius * 0.15,
        0,
        0,
        portal.radius * 1.1,
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.5, rgba(portal.color, 0.85));
      gradient.addColorStop(1, rgba(portal.color, 0));

      ctx.beginPath();
      ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = portal.glow;
      ctx.shadowColor = rgba(portal.color, 0.8);
      ctx.fill();
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

      const audioInfluence = clamp(audioRef.current, 0, 1);

      portals.forEach((portal) => drawPortal(portal, time, audioInfluence));

      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [portalCount]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#000a3a] via-[#001981] to-[#0132ff]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.45),rgba(1,18,94,0)_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000a32]/50" />
    </div>
  );
}


