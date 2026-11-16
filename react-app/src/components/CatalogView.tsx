import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Square,
  MapPin,
  Microscope,
  Sparkles,
  CheckCircle2,
  Radio,
  Layers
} from 'lucide-react';
import {
  CATALOG_DATA,
  BODY_LABELS,
  STATUS_LABELS,
  STATUS_HEX,
  CatalogItem,
  BodyType,
  RelicStatus,
  Lang,
  formatCoords,
  formatLightTime,
  itemLightSeconds
} from '../data/catalog';
import { SpaceAudio } from '../utils/audioAndVoice';
import { getMissionMarkerUrl } from './missionMarkers';

interface CatalogViewProps {
  lang: Lang;
  exploredIds: Record<string, boolean>;
  speakingId: string | null;
  onToggleSpeak: (text: string, id: string) => void;
  onViewOnMap: (item: CatalogItem) => void;
  onOpenDeepDiagnostic: (deepId: string) => void;
  onPingCatalogItem: (item: CatalogItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  lang,
  exploredIds,
  speakingId,
  onToggleSpeak,
  onViewOnMap,
  onOpenDeepDiagnostic,
  onPingCatalogItem
}) => {
  const [bodyFilter, setBodyFilter] = useState<'ALL' | BodyType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RelicStatus>('ALL');
  const [query, setQuery] = useState('');

  const filtered = CATALOG_DATA.filter(item => {
    if (bodyFilter !== 'ALL' && item.body !== bodyFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.name[lang].toLowerCase().includes(q) ||
        item.site[lang].toLowerCase().includes(q) ||
        item.story[lang].toLowerCase().includes(q) ||
        item.kind[lang].toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exploredCount = CATALOG_DATA.filter(c => exploredIds[c.id]).length;

  return (
    <div className="max-w-[1600px] w-full mx-auto p-3 sm:p-5 space-y-4">
      {/* Banner & Filters */}
      <div className="bg-[#09152b]/95 border border-cyan-500/25 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              {lang === 'uz'
                ? `NASA Koinot Merosi Katalogi (${CATALOG_DATA.length} ta mashhur apparat)`
                : `NASA Space Hardware Catalog (${CATALOG_DATA.length} Iconic Relics)`}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300">
              {exploredCount}/{CATALOG_DATA.length} {lang === 'uz' ? 'o‘rganildi' : 'explored'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'uz'
              ? 'Apollo 11, Viking 1–2, Spirit, Sojourner, Phoenix, InSight, Curiosity, Perseverance, Cassini, New Horizons va boshqalar — har birini eshiting yoki xaritada ko‘ring (+50 XP).'
              : 'Apollo 11, Viking 1–2, Spirit, Sojourner, Phoenix, InSight, Curiosity, Perseverance, Cassini, New Horizons & more — listen to their stories or locate them on the map (+50 XP each).'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={lang === 'uz' ? 'Missiya yoki joy nomini yozing...' : 'Search mission or site...'}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none w-52"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'moon', 'mars', 'deepspace'] as const).map(b => (
              <button
                key={b}
                onClick={() => {
                  setBodyFilter(b);
                  SpaceAudio.blip();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  bodyFilter === b
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b === 'ALL' ? (lang === 'uz' ? 'Barchasi' : 'All') : BODY_LABELS[b][lang]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'ACTIVE', 'PARTIAL', 'OFFLINE'] as const).map(st => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  SpaceAudio.blip();
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${
                  statusFilter === st
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? (lang === 'uz' ? 'HOLAT: HAMMASI' : 'ALL') : STATUS_LABELS[st][lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#09152b]/80 border border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-400">
          {lang === 'uz'
            ? 'Qidiruv bo‘yicha qurilma topilmadi. Filtrni tozalab ko‘ring.'
            : 'No spacecraft matched your filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => {
            const isSpeaking = speakingId === item.id;
            const isExplored = !!exploredIds[item.id];
            const lightSec = itemLightSeconds(item);

            return (
              <div
                key={item.id}
                className="bg-[#09152b]/90 border border-slate-800 hover:border-cyan-500/45 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0">
                        <img src={getMissionMarkerUrl(item.id)} alt={item.name[lang]} className="w-full h-full object-contain p-0.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {BODY_LABELS[item.body][lang]}
                          </span>
                          <span
                            style={{ color: STATUS_HEX[item.status], borderColor: STATUS_HEX[item.status] }}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-slate-950"
                          >
                            ● {STATUS_LABELS[item.status][lang]}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.year}
                            {item.endYear ? `–${item.endYear}` : '+'}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1 leading-snug">
                          {item.name[lang]}
                        </h3>
                      </div>
                    </div>

                    {isExplored && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +50XP
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 rounded-lg px-2.5 py-1.5 border border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="truncate">📍 {item.site[lang]}</span>
                    <span className="text-cyan-400 shrink-0">{formatCoords(item)}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">{item.story[lang]}</p>

                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item.fact[lang]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onToggleSpeak(`${item.name[lang]}. ${item.story[lang]} ${item.fact[lang]}`, item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-colors ${
                      isSpeaking
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-200'
                    }`}
                  >
                    {isSpeaking ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? (lang === 'uz' ? 'Stop' : 'Stop') : (lang === 'uz' ? 'Eshitish' : 'Listen')}</span>
                  </button>

                  <button
                    onClick={() => onPingCatalogItem(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold flex items-center gap-1"
                    title={formatLightTime(lightSec, lang)}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Ping</span>
                  </button>

                  <button
                    onClick={() => onViewOnMap(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 text-[11px] font-bold flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lang === 'uz' ? 'Xaritada' : 'On Map'}</span>
                  </button>

                  {item.deepId && (
                    <button
                      onClick={() => onOpenDeepDiagnostic(item.deepId!)}
                      className="ml-auto px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow"
                    >
                      <Microscope className="w-3.5 h-3.5" />
                      <span>{lang === 'uz' ? '3D & X-Ray' : '3D & X-Ray'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
