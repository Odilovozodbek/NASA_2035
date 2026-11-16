import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NASA_MODELS } from '../data/nasaModels';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Box } from 'lucide-react';
import { buildSpacecraft } from './SpacecraftModels';

interface Spacecraft3DViewerProps {
  relicId: string;
  xrayMode: boolean;
  dustLevel: number;
  timelineYear: number;
  pingWave: boolean;
  fallbackImageUrl?: string;
  fallbackTitle?: string;
  lang: 'uz' | 'en';
}

export const Spacecraft3DViewer: React.FC<Spacecraft3DViewerProps> = ({
  relicId,
  xrayMode,
  dustLevel,
  timelineYear,
  pingWave,
  fallbackImageUrl,
  fallbackTitle,
  lang
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const [showReferenceOverlay, setShowReferenceOverlay] = useState(false);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglError(true);
      return;
    }

    setWebglError(false);
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 360;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#040914');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const cameraPresets: Record<string, [number, number, number]> = {
      'voyager-1': [5.2, 2.0, 4.2],
      'pioneer-10': [5.0, 2.2, 4.4],
      'opportunity-rover': [4.4, 2.3, 4.9],
      'apollo-lrv': [4.8, 2.4, 5.1],
      'ingenuity-heli': [3.9, 2.0, 4.5],
      'surveyor-lrrr': [4.6, 2.1, 4.8]
    };
    const preset = cameraPresets[relicId] || [4.2, 2.5, 4.8];
    camera.position.set(preset[0], preset[1], preset[2]);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.2;
    controls.maxDistance = 12;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.25;
    controlsRef.current = controls;

    // Lighting
    const ambient = new THREE.AmbientLight(0x88bbee, 0.9);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5e0, 2.2);
    sun.position.set(6, 8, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    sun.shadow.bias = -.0004;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x22d3ee, 1.1);
    rim.position.set(-6, 3, -5);
    scene.add(rim);

    // Subtle starfield
    const starGeo = new THREE.BufferGeometry();
    const starVerts: number[] = [];
    for (let i = 0; i < 450; i++) {
      starVerts.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcbd5e1, size: 0.08 }));
    scene.add(stars);

    // Realistic regolith in place of the old square game grid.
    // Only the look of the original 3D viewer changes; diagnostics are untouched.
    const isMoon = relicId === 'apollo-lrv' || relicId === 'surveyor-lrrr';
    const isMars = relicId === 'opportunity-rover' || relicId === 'ingenuity-heli';
    if (isMoon || isMars) {
      const SEGMENTS = 96;
      const RINGS = 22;
      const terrainPositions: number[] = [];
      const terrainColors: number[] = [];
      const indices: number[] = [];
      const base = new THREE.Color(isMars ? 0x8a4b38 : 0x777b81);
      for (let ri = 0; ri <= RINGS; ri++) {
        for (let si = 0; si < SEGMENTS; si++) {
          const rad = ri / RINGS * 3.9;
          const a = si / SEGMENTS * Math.PI * 2;
          const x = rad * Math.cos(a), z = rad * Math.sin(a);
          const relief = Math.sin(x * 3.2 + z * 1.7) * .017 +
            Math.sin(x * 6.6 - z * 4.2) * .014 +
            Math.cos(z * 14 + x * 8) * .006;
          terrainPositions.push(x, -.98 + relief, z);
          const shade = Math.max(-.18, Math.min(.2, relief * 4 + Math.sin(x * 9 + z * 13) * .07));
          const c = base.clone().offsetHSL(0, -.03, shade);
          terrainColors.push(c.r, c.g, c.b);
          if (ri > 0) {
            const prev = (ri - 1) * SEGMENTS + si;
            const curr = ri * SEGMENTS + si;
            const prevNext = (ri - 1) * SEGMENTS + ((si + 1) % SEGMENTS);
            const currNext = ri * SEGMENTS + ((si + 1) % SEGMENTS);
            indices.push(prev, curr, prevNext, prevNext, curr, currNext);
          }
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(terrainPositions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(terrainColors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        vertexColors: true, roughness: 1, metalness: 0,
        wireframe: xrayMode, side: THREE.DoubleSide
      }));
      terrain.receiveShadow = true;
      scene.add(terrain);
      // Sparse real-looking pebbles: deterministic so scene stays steady on rerender.
      for (let i = 0; i < 42; i++) {
        const angle = i * 2.399963;
        const rr = 1.9 + 1.6 * Math.sqrt((i + .5) / 42);
        const x = Math.cos(angle) * rr, z = Math.sin(angle) * rr;
        const pebble = new THREE.Mesh(
          new THREE.IcosahedronGeometry(.022 + ((i * 13) % 11) / 130, 0),
          new THREE.MeshStandardMaterial({ color: isMars ? 0x6b3829 : 0x68717a, roughness: 1 })
        );
        pebble.position.set(x, -.95, z);
        pebble.scale.set(1.35, .45, .85);
        scene.add(pebble);
      }
    }

    const { craft, animatedParts } = buildSpacecraft(relicId, { xrayMode, dustLevel, timelineYear });
    const craftRotations: Record<string, number> = {
      'voyager-1': -0.8,
      'pioneer-10': 0.55,
      'opportunity-rover': -0.28,
      'apollo-lrv': 0.24,
      'ingenuity-heli': 0.15,
      'surveyor-lrrr': -0.22
    };
    craft.rotation.y = craftRotations[relicId] || 0;
    craft.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = !xrayMode;
      }
    });
    // Ping wave sphere in 3D
    let pingSphere: THREE.Mesh | null = null;
    if (pingWave) {
      pingSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.7 })
      );
      scene.add(pingSphere);
    }

    scene.add(craft);

    // NASA's own glTF/GLB models replace approximations when the asset loads.
    // The original procedural geometry remains visible as an offline / CORS fallback.
    // This also keeps the 360-degree viewer usable when the connection is slow.
    let disposed = false;
    let nasaCraft: THREE.Group | null = null;
    const modelURL = NASA_MODELS[relicId];
    if (modelURL) {
      const loader = new GLTFLoader();
      loader.setCrossOrigin('anonymous');
      const candidates = window.location.protocol === 'file:'
        ? [modelURL]
        : [`/api/model?id=${encodeURIComponent(relicId)}`, modelURL];
      const tryLoad = (index: number) => {
        if (disposed || index >= candidates.length) {
          if (fallbackImageUrl) setShowReferenceOverlay(true);
          return;
        }
        loader.load(candidates[index], gltf => {
        if (disposed) return;
        setShowReferenceOverlay(false);
        const root = gltf.scene;
        root.updateMatrixWorld(true);
        const bbox = new THREE.Box3().setFromObject(root);
        const dims = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        const longest = Math.max(dims.x, dims.y, dims.z, 0.0001);
        if (!Number.isFinite(longest)) return;
        const ratio = (isMars ? 3.0 : 4.05) / longest;
        root.scale.multiplyScalar(ratio);
        root.position.set(-center.x * ratio, -center.y * ratio, -center.z * ratio);
        if (isMars) root.position.y += -0.70 - (bbox.min.y - center.y) * ratio;
        root.traverse(obj => {
          if (!(obj instanceof THREE.Mesh)) return;
          obj.castShadow = !xrayMode;
          obj.receiveShadow = !xrayMode;
          if (xrayMode) {
            const originalMaterials = Array.isArray(obj.material) ? obj.material : [obj.material];
            const overlayMaterials = originalMaterials.map(mat => {
              const overlay = mat.clone();
              if (overlay instanceof THREE.MeshStandardMaterial) {
                overlay.color.set(0x4dcde7);
                overlay.metalness = 0.25;
              }
              overlay.transparent = true;
              overlay.opacity = 0.60;
              overlay.depthWrite = false;
              overlay.side = THREE.DoubleSide;
              return overlay;
            });
            obj.material = Array.isArray(obj.material) ? overlayMaterials : overlayMaterials[0];
          }
        });
        nasaCraft = new THREE.Group();
        nasaCraft.add(root);
        scene.add(nasaCraft);
        craft.visible = false;
        }, undefined, () => {
          // Try the official direct URL if the same-origin Netlify model proxy isn't deployed.
          craft.visible = true;
          tryLoad(index + 1);
        });
      };
      tryLoad(0);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      controls.autoRotate = autoRotateRef.current;
      controls.update();
      animatedParts.forEach(fn => fn(t));
      if (pingSphere) {
        const s = 1 + (t % 1.4) * 3.2;
        pingSphere.scale.set(s, s, s);
        (pingSphere.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.75 - (t % 1.4) * 0.55);
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      if (nasaCraft) scene.remove(nasaCraft);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [relicId, xrayMode, dustLevel, timelineYear, pingWave]);

  const handleZoom = (factor: number) => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.position.multiplyScalar(factor);
    controlsRef.current?.update();
  };

  const handleReset = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const preset = ({
      'voyager-1': [5.2, 2.0, 4.2],
      'pioneer-10': [5.0, 2.2, 4.4],
      'opportunity-rover': [4.4, 2.3, 4.9],
      'apollo-lrv': [4.8, 2.4, 5.1],
      'ingenuity-heli': [3.9, 2.0, 4.5],
      'surveyor-lrrr': [4.6, 2.1, 4.8]
    } as Record<string, [number, number, number]>)[relicId] || [4.2, 2.5, 4.8];
    cam.position.set(preset[0], preset[1], preset[2]);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  };

  if (webglError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#040914] p-4 text-center">
        {fallbackImageUrl && (
          <img
            src={fallbackImageUrl}
            alt={fallbackTitle || relicId}
            className="max-h-56 rounded-xl border border-cyan-500/30 object-contain mb-2"
          />
        )}
        <p className="text-xs text-slate-400">
          {lang === 'uz'
            ? 'WebGL 3D rejimi brauzerda cheklangan — rasmiy NASA surati ko‘rsatilmoqda.'
            : 'WebGL 3D unavailable in this browser — showing official NASA reference imagery.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#040914]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Interactive HUD Controls */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
        <span className="px-2 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
          <Box className="w-3 h-3" />
          {lang === 'uz' ? '360° 3D MODEL (Sichqoncha bilan aylantiring)' : '360° 3D MODEL (Drag to Orbit)'}
        </span>
      </div>

      {showReferenceOverlay && fallbackImageUrl && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-slate-950/85 border border-cyan-500/35 rounded-lg p-1.5 w-28">
          <img src={fallbackImageUrl} alt={fallbackTitle || relicId} className="w-full h-16 object-cover rounded border border-slate-700" />
          <div className="mt-1 text-[9px] text-cyan-200 font-mono">{lang === 'uz' ? 'NASA REF' : 'NASA REF'}</div>
        </div>
      )}

      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs"
          title={lang === 'uz' ? 'Avto-aylanish' : 'Toggle Auto-Rotate'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => handleZoom(0.85)}
          className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs"
          title={lang === 'uz' ? 'Yaqinlashtirish' : 'Zoom In'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom(1.18)}
          className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs"
          title={lang === 'uz' ? 'Uzoqlashtirish' : 'Zoom Out'}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs"
          title={lang === 'uz' ? 'Kamerani tiklash' : 'Reset View'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
