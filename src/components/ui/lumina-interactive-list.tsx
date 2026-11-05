import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import notesImage from '../../assets/notes.jpg';
import philosophyImage from '../../assets/philosophy.jpg';
import shotsImage from '../../assets/shots.jpg';
import spaceImage from '../../assets/space.jpg';
import thoughtsImage from '../../assets/thoughts.jpg';
import './lumina-interactive-list.css';

type Slide = { title: string; description: string; media: string };

const slides: Slide[] = [
  { title: 'Notes', description: 'A soft, radiant light that illuminates the soul.', media: notesImage },
  { title: 'Philosophy', description: 'Lost in a desert of blooming dreams and endless horizons.', media: philosophyImage },
  { title: 'Thoughts', description: 'Wrapped in the deep, luxurious embrace of the night.', media: thoughtsImage },
  { title: 'Shots', description: 'That fleeting moment when the world is dipped in gold.', media: shotsImage },
  { title: 'Space', description: 'Where reality fades and imagination takes flight.', media: spaceImage },
];

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
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 imageSize) {
    float screenAspect = uResolution.x / uResolution.y;
    float imageAspect = imageSize.x / imageSize.y;
    if (imageAspect > screenAspect) uv.x = (uv.x - 0.5) * screenAspect / imageAspect + 0.5;
    else uv.y = (uv.y - 0.5) * imageAspect / screenAspect + 0.5;
    return uv;
  }

  void main() {
    vec2 uv1 = coverUv(vUv, uTexture1Size);
    vec2 uv2 = coverUv(vUv, uTexture2Size);
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
    vec2 waterUv = uv2 + radial * rim * 0.012;
    vec4 oldImage = texture2D(uTexture1, uv1);
    vec4 newImage = texture2D(uTexture2, waterUv);
    gl_FragColor = mix(oldImage, newImage, reveal);
    gl_FragColor.rgb += rim * vec3(0.10, 0.16, 0.18);
  }
`;

export function Component() {
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
      console.error('WebGL is unavailable for the Lumina slider.', error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const size = new THREE.Vector2(1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 1 },
        uResolution: { value: size.clone() }, uTexture1Size: { value: size.clone() }, uTexture2Size: { value: size.clone() },
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
    Promise.all(slides.map((slide) => new Promise<THREE.Texture | null>((resolve) => {
      loader.load(slide.media, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      }, undefined, () => resolve(null));
    }))).then((loaded) => {
      if (disposed) {
        loaded.forEach((texture) => texture?.dispose());
        return;
      }
      const fallback = loaded.find((texture): texture is THREE.Texture => texture !== null);
      const textures = loaded.map((texture) => texture ?? fallback).filter((texture): texture is THREE.Texture => texture !== undefined);
      texturesRef.current = textures;
      if (textures.length) {
        const first = textures[0];
        const dimensions = first.image as HTMLImageElement;
        material.uniforms.uTexture1.value = first;
        material.uniforms.uTexture2.value = first;
        material.uniforms.uTexture1Size.value.set(dimensions.naturalWidth || dimensions.width, dimensions.naturalHeight || dimensions.height);
        material.uniforms.uTexture2Size.value.copy(material.uniforms.uTexture1Size.value);
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
  }, []);

  const goToSlide = (target: number) => {
    const material = materialRef.current;
    const textures = texturesRef.current;
    if (!material || transitioningRef.current || target === activeRef.current || textures.length !== slides.length) return;

    transitioningRef.current = true;
    setIsTransitioning(true);
    const currentTexture = textures[activeRef.current];
    const nextTexture = textures[target];
    const currentSize = currentTexture.image as HTMLImageElement;
    const nextSize = nextTexture.image as HTMLImageElement;
    material.uniforms.uTexture1.value = currentTexture;
    material.uniforms.uTexture2.value = nextTexture;
    material.uniforms.uTexture1Size.value.set(currentSize.naturalWidth || currentSize.width, currentSize.naturalHeight || currentSize.height);
    material.uniforms.uTexture2Size.value.set(nextSize.naturalWidth || nextSize.width, nextSize.naturalHeight || nextSize.height);
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
        material.uniforms.uTexture1Size.value.copy(material.uniforms.uTexture2Size.value);
        material.uniforms.uProgress.value = 1;
        transitioningRef.current = false;
        setIsTransitioning(false);
      },
    });
  };

  const goToNextSlide = () => goToSlide((activeRef.current + 1) % slides.length);

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      if (!isTransitioning && !transitioningRef.current) {
        goToNextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ready, isTransitioning]);

  const slide = slides[active];
  return (
    <main ref={containerRef} className={`slider-wrapper${ready ? ' is-ready' : ''}${isTransitioning ? ' is-transitioning' : ''}`}>
      <canvas ref={canvasRef} className="webgl-canvas" aria-hidden="true" />
      <div className="slider-shade" />
      <span className="slide-number">Tirth S Pandya</span>
      <span className="slide-total">where curiosity begins</span>
      <div ref={contentRef} className={`content-reveal${active === 0 ? ' is-initial' : ''}`}>
        <section className="slide-content" aria-live="polite">
          <h1 className="slide-title"><button type="button" className="slide-title-button" onClick={goToNextSlide} aria-label={`Next slide. Current slide: ${slide.title}`}>{slide.title}</button></h1>
          <p className="slide-description">{slide.description}</p>
        </section>
      </div>
      <nav className="slides-navigation" aria-label="Choose a slide">
        {slides.map((item, index) => <button key={item.title} type="button" className={`slide-nav-item${index === active ? ' active' : ''}`} onClick={() => goToSlide(index)} aria-current={index === active ? 'true' : undefined}>
          <span className="slide-progress-line"><span key={`${index}-${active}`} className="slide-progress-fill" /></span>
          <span className="slide-nav-title">{item.title}</span>
        </button>)}
      </nav>
    </main>
  );
}
