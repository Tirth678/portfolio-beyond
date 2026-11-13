'use client';

import { useEffect, useRef } from 'react';

// The supplied codeflower preset, adapted to the site's monochrome palette.
const SOURCE = '/images/codeflower-source.webp';
const CELL_SIZE = 13;
const CHARACTERS = ' .,:;irsXA253hMHGS#9B&@';

/** Canvas2D implementation of the supplied characters/flicker preset. */
export function AsciiComingSoon() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!wrapper || !canvas || !context) return;

    const source = new Image();
    const raster = document.createElement('canvas');
    const sample = document.createElement('canvas');
    const glow = document.createElement('canvas');
    const rasterContext = raster.getContext('2d', { willReadFrequently: true });
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    const glowContext = glow.getContext('2d');
    if (!rasterContext || !sampleContext || !glowContext) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let loaded = false;
    let visible = true;
    let frame = 0;
    let lastFrame = 0;
    let cellValues: Float32Array = new Float32Array(0);
    let columns = 0;
    let rows = 0;

    function prepare() {
      if (!wrapper || !canvas || !context || !rasterContext || !sampleContext || !glowContext) return;
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      // A capped pixel ratio keeps the grid readable and the animation economical.
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      raster.width = width;
      raster.height = height;
      glow.width = width;
      glow.height = height;
      columns = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);
      sample.width = columns;
      sample.height = rows;
      cellValues = new Float32Array(columns * rows);
      if (!loaded) {
        context.clearRect(0, 0, width, height);
        return;
      }

      // Cover the target, then downsample the full image to average each cell.
      const scale = Math.max(width / source.naturalWidth, height / source.naturalHeight);
      const imageWidth = source.naturalWidth * scale;
      const imageHeight = source.naturalHeight * scale;
      rasterContext.clearRect(0, 0, width, height);
      rasterContext.drawImage(source, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
      sampleContext.imageSmoothingEnabled = true;
      sampleContext.drawImage(raster, 0, 0, columns, rows);
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      for (let i = 0; i < cellValues.length; i++) {
        const offset = i * 4;
        const luminance = (pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722) / 255;
        // Preset: brightness 0, contrast 115, linear tone curve. Monochrome replaces the green tint.
        cellValues[i] = Math.max(0, Math.min(1, (luminance - 0.5) * 1.15 + 0.5));
      }
    }

    function render(time: number) {
      if (!context || !glowContext || !loaded) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);
      // bgMode blur, bgBlur 1, bgOpacity 100; desaturate to match the site.
      context.save();
      context.filter = 'grayscale(1) contrast(115%) blur(1px)';
      context.globalAlpha = 0.5;
      context.drawImage(raster, 0, 0);
      context.restore();

      glowContext.clearRect(0, 0, width, height);
      glowContext.font = `${CELL_SIZE}px monospace`;
      glowContext.textAlign = 'center';
      glowContext.textBaseline = 'middle';
      const tick = Math.floor(time / 110);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const index = row * columns + column;
          const value = cellValues[index];
          const flicker = motion.matches ? 0 : (Math.sin(index * 91.17 + tick * 2.1) * 0.5 + 0.5) * 0.16 * 0.6;
          const level = Math.max(0, Math.min(1, value + flicker - 0.048));
          const character = CHARACTERS[Math.floor(level * (CHARACTERS.length - 1))];
          const light = Math.round(75 + level * 180);
          glowContext.fillStyle = `rgba(${light},${light},${light},${0.25 + level * 0.75})`;
          glowContext.fillText(character, column * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
        }
      }
      // styleBlend overlay plus bloom at 25%.
      context.save();
      context.globalCompositeOperation = 'screen';
      context.filter = 'blur(4px)';
      context.globalAlpha = 0.25;
      context.drawImage(glow, 0, 0);
      context.filter = 'none';
      context.globalAlpha = 0.92;
      context.drawImage(glow, 0, 0);
      context.restore();

      // Scan lines (45%) and vignette (62%).
      context.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < height; y += 4) context.fillRect(0, y, width, 1);
      const vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.12, width / 2, height / 2, Math.max(width, height) * 0.68);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.62)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);
    }

    function animate(time: number) {
      frame = 0;
      if (!visible || document.hidden || !loaded) return;
      if (time - lastFrame >= 100 || motion.matches) {
        render(time);
        lastFrame = time;
      }
      if (!motion.matches) frame = window.requestAnimationFrame(animate);
    }
    function start() {
      if (!frame && visible && !document.hidden && loaded) frame = window.requestAnimationFrame(animate);
    }
    function refresh() {
      prepare();
      if (loaded) render(performance.now());
      start();
    }
    const resize = new ResizeObserver(refresh);
    resize.observe(wrapper);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(wrapper);
    const onVisibility = () => {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', refresh);
    source.onload = () => { loaded = true; refresh(); };
    source.src = SOURCE;
    prepare();

    return () => {
      source.onload = null;
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', refresh);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden bg-[#050505] sm:min-h-[500px]">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/35" />
      <p className="relative px-6 text-center font-display text-[clamp(2.7rem,9vw,7.5rem)] leading-none italic tracking-[-0.03em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">Coming soon</p>
    </div>
  );
}
