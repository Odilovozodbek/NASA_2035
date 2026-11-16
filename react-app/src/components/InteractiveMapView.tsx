import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Map as MapIcon,
  Globe,
  Radio,
  Volume2,
  Square,
  Search,
  Microscope,
  Sparkles,
  Camera,
  CheckCircle2,
  Compass,
  Clock
} from 'lucide-react';
import {
  CATALOG_DATA,
  MOON_FEATURES,
  MARS_FEATURES,
  BODY_LABELS,
  STATUS_LABELS,
  STATUS_HEX,
  CatalogItem,
  BodyType,
  RelicStatus,
  Lang,
  itemDistanceKm,
  itemLightSeconds,
  formatLightTime,
  formatCoords
} from '../data/catalog';
import { SpaceAudio } from '../utils/audioAndVoice';
import { getMissionMarkerUrl } from './missionMarkers';

interface InteractiveMapViewProps {
  lang: Lang;
  selectedCatalogId: string;
  onSelectCatalogItem: (item: CatalogItem) => void;
  onOpenDeepDiagnostic: (deepId: string) => void;
  onPingCatalogItem: (item: CatalogItem) => void;
  onToggleSpeak: (text: string, id: string) => void;
  speakingId: string | null;
  pingTargetId: string | null;
  exploredIds: Record<string, boolean>;
  onOpenPhotoModal: (photo: { title: string; url: string; date: string }) => void;
}

// 3D Textured Planet Globe (Moon or Mars) with clickable 3D pins
const PlanetGlobe3D: React.FC<{
  body: 'moon' | 'mars';
  items: CatalogItem[];
  selectedId: string;
  onSelect: (item: CatalogItem) => void;
}> = ({ body, items, selectedId, onSelect }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const w = container.clientWidth || 640;
    const h = container.clientHeight || 360;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#040914');

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0.6, 4.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.1;
    controls.maxDistance = 7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;

    scene.add(new THREE.AmbientLight(0xdbeafe, 1.35));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const loader = new THREE.TextureLoader();
    const tex = loader.load(body === 'moon' ? '/textures/moon.jpg' : '/textures/mars.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;

    const radius = 1.35;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 48, 36),
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.9,
        metalness: 0.05
      })
    );
    scene.add(sphere);

    // Subtle atmosphere/halo rim
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.03, 32, 24),
      new THREE.MeshBasicMaterial({
        color: body === 'mars' ? 0xfb923c : 0x38bdf8,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
      })
    );
    scene.add(halo);

    // Convert (lat, lon) on equirectangular SphereGeometry to 3D Cartesian
    const latLonToVec3 = (lat: number, lon: number, r: number) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      const x = -r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Real spacecraft silhouette icons are mapped to exact mission coordinates.
    // The planet globe remains orbitable and the same pins remain clickable.
    const pinMeshes: THREE.Sprite[] = [];
    const markerTextures: THREE.Texture[] = [];
    items.forEach(item => {
      const pos = latLonToVec3(item.lat ?? 0, item.lon ?? 0, radius + 0.060);
      const isSel = item.id === selectedId;
      const markerTexture = loader.load(getMissionMarkerUrl(item.id));
      markerTexture.colorSpace = THREE.SRGBColorSpace;
      markerTextures.push(markerTexture);
      const pin = new THREE.Sprite(new THREE.SpriteMaterial({
        map: markerTexture,
        color: isSel ? 0xe5ffff : 0xffffff,
        transparent: true,
        depthTest: true,
        depthWrite: false
      }));
      pin.scale.set(isSel ? .38 : .29, isSel ? .38 : .29, 1);
      pin.position.copy(pos);
      pin.userData = { id: item.id };
      scene.add(pin);
      pinMeshes.push(pin);
    });

    // Click detection on 3D pins
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([...pinMeshes, sphere]);
      // Don't let a marker on the far side of the planet be clickable through it.
      if (hits.length > 0 && hits[0].object !== sphere) {
        const hitId = hits[0].object.userData.id;
        const found = itemsRef.current.find(i => i.id === hitId);
        if (found) onSelectRef.current(found);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 640;
      const nh = container.clientHeight || 360;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(frameId);
      controls.dispose();
      markerTextures.forEach(t => t.dispose());
      tex.dispose();
      renderer.dispose();
    };
  }, [body, items, selectedId]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  lang,
  selectedCatalogId,
  onSelectCatalogItem,
  onOpenDeepDiagnostic,
  onPingCatalogItem,
  onToggleSpeak,
  speakingId,
  pingTargetId,
  exploredIds,
  onOpenPhotoModal
}) => {
  const [mapBody, setMapBody] = useState<BodyType>('moon');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RelicStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [planetProjection, setPlanetProjection] = useState<'2d' | '3d'>('2d');
  const [mapPhotos, setMapPhotos] = useState<Array<{ title: string; url: string; date: string }>>([]);
  const [loadingMapPhotos, setLoadingMapPhotos] = useState(false);

  const selectedItem =
    CATALOG_DATA.find(c => c.id === selectedCatalogId) ||
    CATALOG_DATA.find(c => c.body === mapBody) ||
    CATALOG_DATA[0];

  // Keep mapBody aligned when user picks an item from outside
  useEffect(() => {
    if (selectedItem && selectedItem.body !== mapBody) {
      setMapBody(selectedItem.body);
    }
  }, [selectedCatalogId]);

  // Fetch NASA Image Library thumbnails for selected map relic
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!selectedItem) return;
      setLoadingMapPhotos(true);
      try {
        const res = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(selectedItem.nasaQuery)}&media_type=image`
        );
        const json = await res.json();
        const items = json?.collection?.items || [];
        const imgs = items
          .slice(0, 3)
          .map((it: { data?: Array<{ title?: string; date_created?: string }>; links?: Array<{ href?: string }> }) => ({
            title: it.data?.[0]?.title || selectedItem.name[lang],
            url: it.links?.[0]?.href || '',
            date: (it.data?.[0]?.date_created || '').slice(0, 10)
          }))
          .filter((x: { url: string }) => x.url);
        if (active) setMapPhotos(imgs);
      } catch {
        if (active) setMapPhotos([]);
      } finally {
        if (active) setLoadingMapPhotos(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [selectedItem?.id]);

  const filteredItems = CATALOG_DATA.filter(item => {
    if (item.body !== mapBody) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name[lang].toLowerCase().includes(q) ||
        item.site[lang].toLowerCase().includes(q) ||
        item.kind[lang].toLowerCase().includes(q)
      );
    }
    return true;
  });

  const surfaceFeatures = mapBody === 'moon' ? MOON_FEATURES : MARS_FEATURES;
  const distKm = itemDistanceKm(selectedItem);
  const lightSec = itemLightSeconds(selectedItem);

  const handleSelectBody = (b: BodyType) => {
    setMapBody(b);
    const first = CATALOG_DATA.find(c => c.body === b);
    if (first) onSelectCatalogItem(first);
    SpaceAudio.blip();
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT / MAIN MAP AREA (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        {/* Map Control Bar */}
        <div className="bg-[#09152b]/95 border border-cyan-500/25 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5">
          {/* Body Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
            {(['moon', 'mars', 'deepspace'] as BodyType[]).map(b => {
              const count = CATALOG_DATA.filter(c => c.body === b).length;
              return (
                <button
                  key={b}
                  onClick={() => handleSelectBody(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapBody === b
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{BODY_LABELS[b][lang]}</span>
                  <span className="text-[10px] px-1.5 rounded-full bg-slate-950/60 text-cyan-200">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'uz' ? 'Qidirish (Apollo, Spirit...)' : 'Search (Apollo, Spirit...)'}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none w-44"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['ALL', 'ACTIVE', 'PARTIAL', 'OFFLINE'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    SpaceAudio.blip();
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                    statusFilter === st
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? (lang === 'uz' ? 'BARCHASI' : 'ALL') : STATUS_LABELS[st][lang]}
                </button>
              ))}
            </div>

            {mapBody !== 'deepspace' && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setPlanetProjection('2d');
                    SpaceAudio.blip();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                    planetProjection === '2d'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> 2D
                </button>
                <button
                  onClick={() => {
                    setPlanetProjection('3d');
                    SpaceAudio.blip();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                    planetProjection === '3d'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> 3D
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MAP CANVAS */}
        <div className="bg-[#081226] border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                {mapBody === 'moon'
                  ? lang === 'uz'
                    ? 'Oy sirti interaktiv xaritasi (NASA LROC xaritasi)'
                    : 'Interactive Lunar Surface Map (NASA LROC Mosaic)'
                  : mapBody === 'mars'
                  ? lang === 'uz'
                    ? 'Mars sirti interaktiv xaritasi (NASA Viking MDIM xaritasi)'
                    : 'Interactive Martian Surface Map (NASA Viking MDIM Mosaic)'
                  : lang === 'uz'
                  ? 'Quyosh tizimi va Yulduzlararo fazo radar xaritasi'
                  : 'Heliocentric & Interstellar Deep Space Radar Map'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'uz'
                  ? 'Xaritadagi har bir nuqtani bosing — qurilmaning hikoyasi, koordinatasi va signal vaqtini ko‘ring'
                  : 'Click any marker on the map to inspect coordinates, kid-friendly story, and light-time delay'}
              </p>
            </div>

            {mapBody !== 'deepspace' && planetProjection === '2d' && (
              <button
                onClick={() => setShowLandmarks(!showLandmarks)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                  showLandmarks
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {showLandmarks
                  ? lang === 'uz'
                    ? '✓ Krater/Dengiz nomlari'
                    : '✓ Surface Landmarks'
                  : lang === 'uz'
                  ? '○ Nomlarni ko‘rsatish'
                  : '○ Show Landmarks'}
              </button>
            )}
          </div>

          {/* 1) MOON / MARS 2D EQUIRECTANGULAR MAP */}
          {mapBody !== 'deepspace' && planetProjection === '2d' && (
            <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-slate-700/80 bg-[#040914] select-none">
              <img
                src={mapBody === 'moon' ? '/textures/moon.jpg' : '/textures/mars.jpg'}
                alt={mapBody === 'moon' ? 'NASA Lunar Surface Map' : 'NASA Mars Surface Map'}
                className="w-full h-full object-cover opacity-90"
              />

              {/* Coordinate Graticule Overlay */}
              <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full pointer-events-none">
                {[-60, -30, 0, 30, 60].map(lat => (
                  <line
                    key={`lat-${lat}`}
                    x1={0}
                    y1={90 - lat}
                    x2={360}
                    y2={90 - lat}
                    stroke={lat === 0 ? 'rgba(34,211,238,0.35)' : 'rgba(148,163,184,0.18)'}
                    strokeWidth={lat === 0 ? 0.6 : 0.35}
                    strokeDasharray={lat === 0 ? undefined : '2 2'}
                  />
                ))}
                {[-120, -60, 0, 60, 120].map(lon => (
                  <line
                    key={`lon-${lon}`}
                    x1={180 + lon}
                    y1={0}
                    x2={180 + lon}
                    y2={180}
                    stroke={lon === 0 ? 'rgba(34,211,238,0.35)' : 'rgba(148,163,184,0.18)'}
                    strokeWidth={lon === 0 ? 0.6 : 0.35}
                    strokeDasharray={lon === 0 ? undefined : '2 2'}
                  />
                ))}
                <text x="4" y="88" fill="rgba(34,211,238,0.7)" fontSize="4.2" fontFamily="monospace">
                  0° EQ
                </text>
                <text x="182" y="8" fill="rgba(34,211,238,0.7)" fontSize="4.2" fontFamily="monospace">
                  0° PM
                </text>
              </svg>

              {/* Major Surface Landmarks */}
              {showLandmarks &&
                surfaceFeatures
                  .filter(f => !f.minor)
                  .map((feat, idx) => {
                    const leftPct = ((feat.lon + 180) / 360) * 100;
                    const topPct = ((90 - feat.lat) / 180) * 100;
                    return (
                      <div
                        key={idx}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-slate-950/60 text-[9px] sm:text-[10px] font-mono text-slate-200/85 whitespace-nowrap backdrop-blur-[1px]">
                          {feat.name[lang]}
                        </span>
                      </div>
                    );
                  })}

              {/* Clickable Spacecraft Pins */}
              {filteredItems.map(item => {
                const leftPct = (((item.lon ?? 0) + 180) / 360) * 100;
                const topPct = ((90 - (item.lat ?? 0)) / 180) * 100;
                const isSelected = item.id === selectedItem?.id;
                const isPinging = pingTargetId === item.id;
                const col = STATUS_HEX[item.status];

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectCatalogItem(item);
                      SpaceAudio.select();
                    }}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none"
                  >
                    <div
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform ${
                        isSelected ? 'scale-125' : 'hover:scale-110'
                      }`}
                    >
                      <img
                        src={getMissionMarkerUrl(item.id)}
                        alt={item.name[lang]}
                        draggable={false}
                        className="w-full h-full object-contain"
                        style={{ filter: isSelected ? 'drop-shadow(0 0 6px #22d3ee) drop-shadow(0 2px 3px #030712)' : 'drop-shadow(0 2px 4px #030712)' }}
                      />
                      <span
                        className="absolute bottom-0 left-1/4 right-1/4 h-0.5"
                        style={{ backgroundColor: isPinging ? '#22d3ee' : col }}
                      />
                      {isPinging && <span className="absolute -inset-1 border border-cyan-300/80 animate-pulse pointer-events-none" />}
                    </div>
                    <div
                      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-0.5 rounded bg-slate-950/95 border border-cyan-500/40 text-[10px] font-mono whitespace-nowrap transition-opacity ${
                        isSelected ? 'opacity-100 text-cyan-200 font-bold' : 'opacity-0 group-hover:opacity-100 text-slate-200'
                      }`}
                    >
                      {item.name[lang]} ({item.year})
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2) MOON / MARS 3D GLOBE */}
          {mapBody !== 'deepspace' && planetProjection === '3d' && (
            <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-cyan-500/30 bg-[#040914]">
              <PlanetGlobe3D
                body={mapBody}
                items={filteredItems}
                selectedId={selectedItem?.id}
                onSelect={item => {
                  onSelectCatalogItem(item);
                  SpaceAudio.select();
                }}
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 pointer-events-none">
                {lang === 'uz'
                  ? '🌐 3D Sayyora — Aylantiring va markerlarni bosing'
                  : '🌐 3D Globe — Drag to rotate & click pins'}
              </div>
            </div>
          )}

          {/* 3) DEEP SPACE HELIOCENTRIC RADAR MAP */}
          {mapBody === 'deepspace' && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-700/80 bg-[#040914]">
              <svg viewBox="0 0 800 450" className="w-full h-full select-none">
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Logarithmic AU Rings */}
                {[
                  { au: 1, label: 'Earth (1 AU)', color: '#38bdf8' },
                  { au: 5.2, label: 'Jupiter (5.2 AU)', color: '#fb923c' },
                  { au: 9.5, label: 'Saturn (9.5 AU)', color: '#fcd34d' },
                  { au: 30, label: 'Neptune / Kuiper (30 AU)', color: '#60a5fa' },
                  { au: 120, label: 'Heliopause (~120 AU)', color: '#a855f7' },
                  { au: 170, label: 'Interstellar (170 AU)', color: '#10b981' }
                ].map(ring => {
                  const r = (Math.log10(1 + ring.au) / Math.log10(1 + 185)) * 195;
                  return (
                    <g key={ring.au}>
                      <circle
                        cx="400"
                        cy="225"
                        r={r}
                        fill="none"
                        stroke={ring.color}
                        strokeOpacity={0.28}
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      <text
                        x={400 + r + 3}
                        y="223"
                        fill={ring.color}
                        fillOpacity={0.75}
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {ring.label}
                      </text>
                    </g>
                  );
                })}

                {/* Sun */}
                <circle cx="400" cy="225" r="16" fill="url(#sunGlow)" />
                <circle cx="400" cy="225" r="5" fill="#fef08a" />
                <text x="400" y="246" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace">
                  SUN
                </text>

                {/* Deep Space Probes */}
                {filteredItems.map(item => {
                  const r = (Math.log10(1 + (item.au || 1)) / Math.log10(1 + 185)) * 195;
                  const rad = ((item.angle || 0) * Math.PI) / 180;
                  const x = 400 + r * Math.cos(rad);
                  const y = 225 + r * Math.sin(rad);
                  const isSel = item.id === selectedItem?.id;
                  const isPinging = pingTargetId === item.id;
                  const col = STATUS_HEX[item.status];

                  return (
                    <g
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => {
                        onSelectCatalogItem(item);
                        SpaceAudio.select();
                      }}
                    >
                      <line
                        x1="400"
                        y1="225"
                        x2={x}
                        y2={y}
                        stroke={isSel ? '#22d3ee' : col}
                        strokeOpacity={isSel ? 0.8 : 0.35}
                        strokeWidth={isSel ? 2 : 1.2}
                        strokeDasharray="3 3"
                      />
                      {(isSel || isPinging) && (
                        <circle cx={x} cy={y} r="18" fill="none" stroke={isPinging ? '#22d3ee' : col} strokeWidth="2">
                          <animate attributeName="r" from="10" to="28" dur="1.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {isSel && <rect x={x - 18} y={y - 18} width="36" height="36" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="6 3" />}
                      <image
                        href={getMissionMarkerUrl(item.id)}
                        x={x - (isSel ? 21 : 17)}
                        y={y - (isSel ? 21 : 17)}
                        width={isSel ? 42 : 34}
                        height={isSel ? 42 : 34}
                        style={{ filter: 'drop-shadow(0 2px 4px #000)' }}
                      />
                      <text
                        x={x}
                        y={y - 14}
                        textAnchor="middle"
                        fill={isSel ? '#67e8f9' : '#e2e8f0'}
                        fontSize="10"
                        fontWeight={isSel ? 'bold' : 'normal'}
                        fontFamily="monospace"
                      >
                        {item.name[lang]} ({item.au} AU)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Legend & Quick Pins Strip */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> {STATUS_LABELS.ACTIVE[lang]}
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {STATUS_LABELS.PARTIAL[lang]}
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> {STATUS_LABELS.OFFLINE[lang]}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {lang === 'uz'
                ? `Ko‘rsatilmoqda: ${filteredItems.length} ta qurilma`
                : `Showing: ${filteredItems.length} hardware relics`}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT INSPECTOR CARD FOR SELECTED MAP RELIC (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="bg-[#09152b]/95 border border-cyan-500/30 rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-11 h-11 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
                  <img src={getMissionMarkerUrl(selectedItem.id)} alt={selectedItem.name[lang]} className="w-full h-full object-contain p-0.5" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      style={{ color: STATUS_HEX[selectedItem.status], borderColor: STATUS_HEX[selectedItem.status] }}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-slate-950"
                    >
                      ● {STATUS_LABELS[selectedItem.status][lang]}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedItem.year}
                      {selectedItem.endYear ? `–${selectedItem.endYear}` : `–${lang === 'uz' ? 'hozir' : 'present'}`}
                    </span>
                    {exploredIds[selectedItem.id] && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> +50XP
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedItem.name[lang]}</h3>
                  <div className="text-[11px] text-cyan-300 font-medium">{selectedItem.kind[lang]}</div>
                </div>
              </div>
            </div>

            {/* Coordinates & Light Delay */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  {lang === 'uz' ? 'Joylashuv' : 'Location'}
                </div>
                <div className="font-semibold text-slate-200 mt-0.5">{selectedItem.site[lang]}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{formatCoords(selectedItem)}</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {lang === 'uz' ? 'Yorug‘lik vaqti' : '1-Way Light Time'}
                </div>
                <div className="font-mono font-bold text-amber-300 mt-0.5">
                  {formatLightTime(lightSec, lang)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  ≈ {(distKm / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k km
                </div>
              </div>
            </div>

            {/* Kid-friendly 1st-person Story */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-slate-950/90 border border-cyan-500/25 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                  📖 {lang === 'uz' ? 'Qurilmaning o‘z hikoyasi' : 'First-Person Story'}
                </span>
                <button
                  onClick={() =>
                    onToggleSpeak(`${selectedItem.story[lang]} ${selectedItem.fact[lang]}`, selectedItem.id)
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-all ${
                    speakingId === selectedItem.id
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                      : 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/25'
                  }`}
                >
                  {speakingId === selectedItem.id ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      {lang === 'uz' ? 'To‘xtatish' : 'Stop'}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      {lang === 'uz' ? 'Ovozli eshitish' : 'Listen'}
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{selectedItem.story[lang]}</p>
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-amber-200 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{selectedItem.fact[lang]}</span>
              </div>
            </div>

            {/* Live NASA Photos for selected map pin */}
            <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  {lang === 'uz' ? 'NASA Arxiv Suratlari' : 'NASA Image Archive'}
                </span>
                <span className="text-[9px] font-mono text-emerald-400">images-api.nasa.gov</span>
              </div>
              {loadingMapPhotos ? (
                <div className="h-16 flex items-center justify-center text-[11px] font-mono text-slate-400 animate-pulse">
                  {lang === 'uz' ? 'NASA suratlari yuklanmoqda...' : 'Loading NASA imagery...'}
                </div>
              ) : mapPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {mapPhotos.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => onOpenPhotoModal(p)}
                      className="h-16 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all"
                    >
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-2">
                  {lang === 'uz' ? 'Suratlar topilmadi' : 'No preview images returned'}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => onPingCatalogItem(selectedItem)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Radio className={`w-4 h-4 ${pingTargetId === selectedItem.id ? 'animate-ping' : ''}`} />
              <span>{lang === 'uz' ? 'Ushbu qurilmaga SONAR PING yuborish' : 'Send Sonar Ping to This Relic'}</span>
            </button>

            {selectedItem.deepId && (
              <button
                onClick={() => onOpenDeepDiagnostic(selectedItem.deepId!)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all"
              >
                <Microscope className="w-4 h-4" />
                <span>
                  {lang === 'uz'
                    ? 'Chuqur 3D & X-Ray Diagnostikaga o‘tish'
                    : 'Open Deep 3D & X-Ray Diagnostics'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
