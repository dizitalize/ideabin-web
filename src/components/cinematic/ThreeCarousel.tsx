"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MediaItem, CarouselConfig, InteractionConfig, LayoutConfig, StyleConfig } from './types';

interface ThreeCarouselProps {
  media: MediaItem[];
  carouselConfig: CarouselConfig;
  interactionConfig: InteractionConfig;
  layoutConfig: LayoutConfig;
  styleConfig: StyleConfig;
  onSelectMedia?: (item: MediaItem, index: number) => void;
  onActiveIndexChange?: (index: number) => void;
  isDarkTheme?: boolean;
  transitionProgress?: number;
  transitionType?: 'zoom-in' | 'zoom-out';
}

export const ThreeCarousel: React.FC<ThreeCarouselProps> = ({
  media,
  carouselConfig,
  interactionConfig,
  layoutConfig,
  styleConfig,
  onSelectMedia,
  onActiveIndexChange,
  isDarkTheme = true,
  transitionProgress = 1,
  transitionType = 'zoom-in',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeMediaRef = useRef<MediaItem[]>(media);
  activeMediaRef.current = media;

  const onSelectMediaRef = useRef(onSelectMedia);
  onSelectMediaRef.current = onSelectMedia;

  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;

  const transitionRef = useRef({ progress: transitionProgress, type: transitionType });
  transitionRef.current = { progress: transitionProgress, type: transitionType };

  const configsRef = useRef({
    carousel: carouselConfig,
    interaction: interactionConfig,
    layout: layoutConfig,
    style: styleConfig,
    isDark: isDarkTheme,
  });

  configsRef.current = {
    carousel: carouselConfig,
    interaction: interactionConfig,
    layout: layoutConfig,
    style: styleConfig,
    isDark: isDarkTheme,
  };

  const physicsRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastDeltaX: 0,
    targetRotation: (carouselConfig.initialRotation || 0) * (Math.PI / 180),
    currentRotation: (carouselConfig.initialRotation || 0) * (Math.PI / 180),
    initialRotTracker: carouselConfig.initialRotation || 0,
    velocity: 0,
    lastActiveIndex: -1,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      layoutConfig.fov,
      width / height,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';
    container.appendChild(canvas);

    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    let materials: THREE.MeshBasicMaterial[] = [];
    let meshes: THREE.Mesh[] = [];
    let curvedGeometry: THREE.BufferGeometry | null = null;
    const textureLoader = new THREE.TextureLoader();

    // Cache shared video elements & textures so multiple carousel items sharing a video file
    // only decode once in hardware, preventing GPU thread hang on initialization.
    const videoTexturesCache = new Map<string, { video: HTMLVideoElement; texture: THREE.VideoTexture }>();

    const getVideoTexture = (videoUrl: string) => {
      let cached = videoTexturesCache.get(videoUrl);
      if (!cached) {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.preload = 'auto';

        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Handled gracefully on user interaction
          });
        }

        cached = { video, texture };
        videoTexturesCache.set(videoUrl, cached);
      }
      return cached.texture;
    };

    carouselGroup.rotation.y = physicsRef.current.currentRotation;

    const buildScene = () => {
      const cfg = configsRef.current;
      carouselGroup.clear();

      if (curvedGeometry) curvedGeometry.dispose();
      materials.forEach((mat) => {
        // Video textures are managed and disposed in videoTexturesCache
        if (mat.map && !(mat.map instanceof THREE.VideoTexture)) {
          mat.map.dispose();
        }
        mat.dispose();
      });
      materials = [];
      meshes = [];

      const effectiveBg = '#000000';
      scene.background = cfg.style.transparentBg ? null : new THREE.Color(0x000000);

      if (cfg.style.fog) {
        scene.fog = new THREE.Fog(0x000000, cfg.style.fogNear, cfg.style.fogFar);
      } else {
        scene.fog = null;
      }

      const isMobile = width < 768;
      const fovAdjust = isMobile ? cfg.layout.fov + 8 : cfg.layout.fov;
      const cameraZAdjust = isMobile ? cfg.layout.cameraZ + 3.5 : cfg.layout.cameraZ;
      const cameraXAdjust = isMobile ? cfg.layout.cameraX * 0.6 : cfg.layout.cameraX;

      camera.fov = fovAdjust;
      camera.position.set(cameraXAdjust, cfg.layout.cameraY, cameraZAdjust);
      camera.rotation.set(0, cfg.layout.cameraPanY * (Math.PI / 180), 0);
      camera.updateProjectionMatrix();

      const itemW = cfg.carousel.itemWidth;
      const itemH = cfg.carousel.itemHeight;
      const radius = cfg.carousel.radius;
      const totalCount = Math.max(3, cfg.carousel.count || 14);

      curvedGeometry = new THREE.PlaneGeometry(itemW, itemH, 32, 1);
      const pos = curvedGeometry.attributes.position;
      const uv = curvedGeometry.attributes.uv;

      for (let i = 0; i < pos.count; i++) {
        const t = pos.getX(i) / radius;
        pos.setX(i, Math.sin(t) * radius);
        pos.setZ(i, Math.cos(t) * radius - radius);
        uv.setX(i, 1 - uv.getX(i));
      }
      curvedGeometry.computeVertexNormals();

      const mediaItems = activeMediaRef.current;
      const mediaList = mediaItems.length > 0 ? mediaItems : [{ id: 'fallback', title: 'Curved', subtitle: '', mediaType: 'image' as const }];

      for (let i = 0; i < totalCount; i++) {
        const item = mediaList[i % mediaList.length];
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });

        const createCleanPlaceholder = (title: string) => {
          const cvs = document.createElement('canvas');
          cvs.width = 512;
          cvs.height = 700;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#0f0f13';
            ctx.fillRect(0, 0, 512, 700);
            ctx.strokeStyle = '#27272a';
            ctx.lineWidth = 4;
            ctx.strokeRect(16, 16, 480, 668);
            ctx.fillStyle = '#e4e4e7';
            ctx.font = '600 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title || 'Studio Asset', 256, 350);
          }
          const tex = new THREE.CanvasTexture(cvs);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        if (item.video) {
          material.map = getVideoTexture(item.video);
          material.needsUpdate = true;
        } else if (item.image) {
          textureLoader.load(
            item.image,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.minFilter = THREE.LinearFilter;
              material.map = tex;
              material.needsUpdate = true;
            },
            undefined,
            () => {
              material.map = createCleanPlaceholder(item.title || 'Studio Piece');
              material.needsUpdate = true;
            }
          );
        } else {
          material.map = createCleanPlaceholder(item.title || `Asset ${i + 1}`);
        }

        materials.push(material);

        const mesh = new THREE.Mesh(curvedGeometry, material);
        mesh.userData = { index: i, mediaItem: item };

        const angle = (i / totalCount) * Math.PI * 2;
        mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
        mesh.rotation.y = angle;

        carouselGroup.add(mesh);
        meshes.push(mesh);
      }
    };

    buildScene();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      const p = physicsRef.current;
      p.isDragging = true;
      p.startX = e.clientX;
      p.startY = e.clientY;
      p.startTime = performance.now();
      p.lastX = e.clientX;
      p.lastDeltaX = 0;
      p.velocity = 0;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture(e.pointerId);

      videoTexturesCache.forEach(({ video }) => {
        if (video.paused) video.play().catch(() => {});
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.isDragging) return;

      const deltaX = e.clientX - p.lastX;
      p.lastDeltaX = deltaX;
      p.lastX = e.clientX;
      p.velocity = deltaX;
      p.targetRotation -= deltaX * 0.008;
    };

    const onPointerUp = (e: PointerEvent) => {
      const p = physicsRef.current;
      const movedDistance = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
      const elapsed = performance.now() - p.startTime;

      p.isDragging = false;
      canvas.style.cursor = 'grab';
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }

      if (movedDistance < 8 && elapsed < 350) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const { mediaItem, index } = hit.userData;
          if (mediaItem && onSelectMediaRef.current) {
            onSelectMediaRef.current(mediaItem, index);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 1) {
        e.preventDefault();
        physicsRef.current.targetRotation += delta * 0.0055;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const rect = entries[0].contentRect;
      if (rect.width === 0 || rect.height === 0) return;

      width = rect.width;
      height = rect.height;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;

      const isMobile = width < 768;
      const cfg = configsRef.current;
      camera.fov = isMobile ? cfg.layout.fov + 8 : cfg.layout.fov;
      camera.position.z = isMobile ? cfg.layout.cameraZ + 3.5 : cfg.layout.cameraZ;
      camera.position.x = isMobile ? cfg.layout.cameraX * 0.6 : cfg.layout.cameraX;

      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(container);

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const p = physicsRef.current;
      const cfg = configsRef.current;

      if (cfg.interaction.autoPlay && !p.isDragging) {
        p.targetRotation += cfg.interaction.speed * dt;
      }

      const dampingFactor = Math.max(1, cfg.interaction.damping || 14);
      const diff = p.targetRotation - p.currentRotation;

      if (Math.abs(diff) > 1e-4 || p.isDragging) {
        p.currentRotation += diff * dampingFactor * dt;
        carouselGroup.rotation.y = p.currentRotation;
      } else {
        p.currentRotation = p.targetRotation;
        carouselGroup.rotation.y = p.currentRotation;
      }

      if (meshes.length > 0 && onActiveIndexChangeRef.current) {
        const totalCount = meshes.length;
        const sliceAngle = (Math.PI * 2) / totalCount;
        const offset = -cfg.layout.cameraPanY * (Math.PI / 180);
        const normalizedAngle =
          ((-(p.currentRotation + offset) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const activeIdx = Math.round(normalizedAngle / sliceAngle) % totalCount;

        if (activeIdx !== p.lastActiveIndex) {
          p.lastActiveIndex = activeIdx;
          const item = meshes[activeIdx]?.userData?.mediaItem;
          if (item) {
            onActiveIndexChangeRef.current(activeIdx);
          }
        }
      }

const tr = transitionRef.current;
       const t = Math.max(0, Math.min(1, tr.progress));
       // Improved easing for more natural motion
       const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

       // Determine direction based on transitionType
       const isZoomIn = tr.type === 'zoom-in';

       const isMobile = width < 768;
       const baseCameraZ = isMobile ? cfg.layout.cameraZ + 3.5 : cfg.layout.cameraZ;
       const baseCameraX = isMobile ? cfg.layout.cameraX * 0.6 : cfg.layout.cameraX;

       if (t < 1) {
         // Refined continuous cinematic transition based on type:
         // zoom-in: camera moves from far to near (current behavior enhanced)
         // zoom-out: camera moves from near to far (opposite direction)
         const zoomOffset = isZoomIn 
           ? (1 - ease) * 8.0    // Far to near for zoom-in
           : ease * 8.0;         // Near to far for zoom-out
         
         const scaleFactor = isZoomIn
           ? 0.70 + ease * 0.30  // Small to normal for zoom-in
           : 1.0 - ease * 0.30;  // Normal to small for zoom-out
           
         const positionY = isZoomIn
           ? (1 - ease) * -0.4   // Below to center for zoom-in
           : ease * -0.4;        // Center to below for zoom-out
           
         const rotationOffset = isZoomIn
           ? (1 - ease) * 0.2    // Extra rotation to normal for zoom-in
           : ease * 0.2;         // Normal to extra rotation for zoom-out
         
         camera.position.z = baseCameraZ + zoomOffset;
         carouselGroup.scale.setScalar(scaleFactor);
         carouselGroup.position.y = positionY;
         carouselGroup.rotation.y = p.currentRotation + rotationOffset;
       } else {
         camera.position.z = baseCameraZ;
         carouselGroup.scale.setScalar(1.0);
         carouselGroup.position.y = 0;
       }
       camera.position.x = baseCameraX;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);

      scene.clear();
      if (curvedGeometry) curvedGeometry.dispose();
      materials.forEach((m) => {
        if (m.map && !(m.map instanceof THREE.VideoTexture)) {
          m.map.dispose();
        }
        m.dispose();
      });

      videoTexturesCache.forEach(({ video, texture }) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        texture.dispose();
      });
      videoTexturesCache.clear();

      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [layoutConfig.fov]);

  return (
    <div
      ref={containerRef}
      id="three-carousel-container"
      className="w-full h-full relative overflow-hidden select-none bg-transparent"
    />
  );
};
