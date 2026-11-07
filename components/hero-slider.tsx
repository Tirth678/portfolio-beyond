'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { HeroSlide } from '@/lib/types';
import './hero-slider.css';

const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uTexture1Size;
  uniform vec2 uTexture2Size;
  uniform float uTexture1FitMobile;
  uniform float uTexture2FitMobile;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 imageSize) {
    float screenAspect = uResolution.x / uResolution.y;
    float imageAspect = imageSize.x / imageSize.y;
    if (imageAspect > screenAspect) uv.x = (uv.x - 0.5) * screenAspect / imageAspect + 0.5;
    else uv.y = (uv.y - 0.5) * imageAspect / screenAspect + 0.5;
    return uv;
  }

  vec4 sampleImage(sampler2D image, vec2 uv, vec2 imageSize, float fitMobile) {
    vec2 cover = coverUv(uv, imageSize);
    vec4 backdrop = texture2D(image, cover);
    float screenAspect = uResolution.x / uResolution.y;
    if (fitMobile < 0.5 || screenAspect >= 0.85) return backdrop;

    // Show the whole image on portrait screens over a dimmed, cover-sized
    // copy, keeping its subject and context visible without empty black bars.
    float imageAspect = imageSize.x / imageSize.y;
    vec2 contained = uv;
    if (imageAspect > screenAspect) contained.y = (uv.y - 0.5) * imageAspect / screenAspect + 0.5;
    else contained.x = (uv.x - 0.5) * screenAspect / imageAspect + 0.5;
    bool inside = contained.x >= 0.0 && contained.x <= 1.0 && contained.y >= 0.0 && contained.y <= 1.0;
    return inside ? texture2D(image, contained) : vec4(backdrop.rgb * 0.18, 1.0);
  }

  void main() {
    vec2 p = (vUv - 0.5) * uResolution;
    float distanceFromCenter = length(p);
    float angle = atan(p.y, p.x);
    // The farthest screen corner is half the resolution diagonal. Match that
    // distance so the reveal reaches the final corners at the end of tween.
    float maxRadius = length(uResolution) * 0.51;
    float radius = uProgress * maxRadius;

    // The irregular, softened rim gives the expanding circle a liquid edge.
    float wave = sin(angle * 9.0 + uProgress * 5.0) * 9.0
               + sin(angle * 17.0 - uProgress * 4.0) * 4.0;
    float edgeDistance = distanceFromCenter + wave * (1.0 - uProgress * 0.7);
    float edgeWidth = 1.0 + (1.0 - uProgress) * 5.0;
    float reveal = 1.0 - smoothstep(radius - edgeWidth, radius + edgeWidth, edgeDistance);
    float rim = exp(-pow((edgeDistance - radius) / 15.0, 2.0)) * (1.0 - uProgress);

    vec2 radial = distanceFromCenter > 0.001 ? normalize(p) : vec2(0.0);
    vec2 waterUv = vUv + radial * rim * 0.012;
    vec4 oldImage = sampleImage(uTexture1, vUv, uTexture1Size, uTexture1FitMobile);
    vec4 newImage = sampleImage(uTexture2, waterUv, uTexture2Size, uTexture2FitMobile);
    gl_FragColor = mix(oldImage, newImage, reveal);
    gl_FragColor.rgb += rim * vec3(0.10, 0.16, 0.18);
  }
`;

type HeroSliderProps = {
  slides: HeroSlide[];
  tagline: string;
};

export function HeroSlider({ slides, tagline }: HeroSliderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const activeRef = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch (error) {
      console.error('WebGL is unavailable for the hero slider.', error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const size = new THREE.Vector2(1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 1 },
        uResolution: { value: size.clone() },
        uTexture1Size: { value: size.clone() },
        uTexture2Size: { value: size.clone() },
        uTexture1FitMobile: { value: 0 },
        uTexture2FitMobile: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
    materialRef.current = material;
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
    };
    renderer.setClearColor('#0a0a0a', 1);
    resize();
    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let frame = 0;
    let disposed = false;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    Promise.all(
      slides.map(
        (slide) =>
          new Promise<THREE.Texture | null>((resolve) => {
            loader.load(
              slide.image,
              (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
              },
              undefined,
              () => resolve(null),
            );
          }),
      ),
    ).then((loaded) => {
      if (disposed) {
        loaded.forEach((texture) => texture?.dispose());
        return;
      }
      const fallback = loaded.find(
        (texture): texture is THREE.Texture => texture !== null,
      );
      const textures = loaded
        .map((texture) => texture ?? fallback)
        .filter((texture): texture is THREE.Texture => texture !== undefined);
      texturesRef.current = textures;
      if (textures.length) {
        const first = textures[0];
        const dimensions = first.image as HTMLImageElement;
        material.uniforms.uTexture1.value = first;
        material.uniforms.uTexture2.value = first;
        const fitMobile = slides[0]?.id === 'space' || slides[0]?.id === 'shots' ? 1 : 0;
        material.uniforms.uTexture1FitMobile.value = fitMobile;
        material.uniforms.uTexture2FitMobile.value = fitMobile;
        material.uniforms.uTexture1Size.value.set(
          dimensions.naturalWidth || dimensions.width,
          dimensions.naturalHeight || dimensions.height,
        );
        material.uniforms.uTexture2Size.value.copy(
          material.uniforms.uTexture1Size.value,
        );
        setReady(true);
      }
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      gsap.killTweensOf(material.uniforms.uProgress);
      new Set(texturesRef.current).forEach((texture) => texture.dispose());
      texturesRef.current = [];
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
  }, [slides]);

  const goToSlide = (target: number) => {
    const material = materialRef.current;
    const textures = texturesRef.current;
    if (
      !material ||
      transitioningRef.current ||
      target === activeRef.current ||
      textures.length !== slides.length
    ) {
      return;
    }

    transitioningRef.current = true;
    setIsTransitioning(true);
    const currentTexture = textures[activeRef.current];
    const nextTexture = textures[target];
    const currentSize = currentTexture.image as HTMLImageElement;
    const nextSize = nextTexture.image as HTMLImageElement;
    material.uniforms.uTexture1.value = currentTexture;
    material.uniforms.uTexture2.value = nextTexture;
    material.uniforms.uTexture1FitMobile.value = ['space', 'shots'].includes(slides[activeRef.current].id) ? 1 : 0;
    material.uniforms.uTexture2FitMobile.value = ['space', 'shots'].includes(slides[target].id) ? 1 : 0;
    material.uniforms.uTexture1Size.value.set(
      currentSize.naturalWidth || currentSize.width,
      currentSize.naturalHeight || currentSize.height,
    );
    material.uniforms.uTexture2Size.value.set(
      nextSize.naturalWidth || nextSize.width,
      nextSize.naturalHeight || nextSize.height,
    );
    material.uniforms.uProgress.value = 0;
    activeRef.current = target;
    // Swap the text underneath its mask at the start; the same center-out
    // circle then reveals the new copy in step with the WebGL image.
    setActive(target);
    if (contentRef.current) {
      gsap.killTweensOf(contentRef.current);
      gsap.set(contentRef.current, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 });
      gsap.to(contentRef.current, {
        clipPath: 'circle(72% at 50% 50%)',
        duration: 1.45,
        ease: 'power2.inOut',
      });
    }

    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 1.45,
      ease: 'power2.inOut',
      onComplete: () => {
        material.uniforms.uTexture1.value = nextTexture;
        material.uniforms.uTexture1FitMobile.value = material.uniforms.uTexture2FitMobile.value;
        material.uniforms.uTexture1Size.value.copy(
          material.uniforms.uTexture2Size.value,
        );
        material.uniforms.uProgress.value = 1;
        transitioningRef.current = false;
        setIsTransitioning(false);
      },
    });
  };

  const goToNextSlide = () =>
    goToSlide((activeRef.current + 1) % slides.length);

  useEffect(() => {
    if (!ready) return;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (!isTransitioning && !transitioningRef.current) {
        goToNextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isTransitioning]);

  const slide = slides[active] ?? slides[0];
  if (!slide) return null;

  return (
    <section
      ref={containerRef}
      aria-label="Featured chapters"
      className={`slider-wrapper${ready ? ' is-ready' : ''}${
        isTransitioning ? ' is-transitioning' : ''
      }`}
    >
      <canvas ref={canvasRef} className="webgl-canvas" aria-hidden="true" />
      <div className="slider-shade" />

      <span className="slide-counter" aria-hidden="true">
        0{active + 1} / 0{slides.length}
      </span>

      <div
        ref={contentRef}
        className={`content-reveal${active === 0 ? ' is-initial' : ''}`}
      >
        <section className="slide-content" aria-live="polite">
          <p className="slide-kicker">
            <span className="slide-kicker-dot" aria-hidden="true" />
            {tagline}
          </p>
          <p className="slide-eyebrow">{slide.eyebrow}</p>
          <h1 className="slide-title">
            <button
              type="button"
              className="slide-title-button"
              onClick={goToNextSlide}
              aria-label={`Next chapter. Now showing ${slide.title}`}
            >
              {slide.title}
            </button>
          </h1>
          <p className="slide-description">{slide.description}</p>
        </section>
      </div>

      <nav className="slides-navigation" aria-label="Chapters">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`slide-nav-item${index === active ? ' active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-current={index === active ? 'true' : undefined}
          >
            <span className="slide-progress-line">
              <span key={`${index}-${active}`} className="slide-progress-fill" />
            </span>
            <span className="slide-nav-title">{item.title}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}
