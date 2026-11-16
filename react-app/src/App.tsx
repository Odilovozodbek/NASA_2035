import React, { useState, useEffect, useRef } from 'react';
import {
  Radar,
  Radio,
  BatteryCharging,
  Compass,
  Sparkles,
  Award,
  MessageSquare,
  Microscope,
  Clock,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Globe,
  Send,
  Eye,
  Zap,
  Thermometer,
  ShieldAlert,
  Camera,
  Trophy,
  RefreshCw,
  Layers,
  Map as MapIcon,
  Box,
  Square,
  KeyRound,
  Waves,
  Trash2,
  Cpu
} from 'lucide-react';
import { RELICS_DATA, RelicItem } from './data/relics';
import {
  CATALOG_DATA,
  CatalogItem,
  Lang,
  XP_PER_QUIZ,
  XP_PER_EXPLORE,
  getRank,
  getNextRank,
  formatLightTime,
  itemLightSeconds
} from './data/catalog';
import { SpacecraftBlueprintSVG } from './components/SpacecraftBlueprintSVG';
import { Spacecraft3DViewer } from './components/Spacecraft3DViewer';
import { InteractiveMapView } from './components/InteractiveMapView';
import { CatalogView } from './components/CatalogView';
import { SpaceAudio, Narrator } from './utils/audioAndVoice';
import { Storage } from './utils/storage';

type ViewMode = 'diagnostic' | 'map' | 'catalog';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  source?: 'gemini' | 'archive';
}

export default function App() {
  const initialSaved = useRef(Storage.load()).current;

  // Persisted User Settings & Navigation
  const [lang, setLang] = useState<Lang>(initialSaved.lang || 'uz');
  const [viewMode, setViewMode] = useState<ViewMode>(initialSaved.viewMode || 'diagnostic');
  const [selectedRegion, setSelectedRegion] = useState<'moon' | 'mars' | 'deepspace'>(
    initialSaved.selectedRegion || 'moon'
  );
  const [selectedRelicId, setSelectedRelicId] = useState<string>(
    initialSaved.selectedRelicId || 'apollo-lrv'
  );
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('cat-apollo15');

  // Diagnostic Center Stage State
  const [centerStageMode, setCenterStageMode] = useState<'3d' | 'blueprint'>('blueprint');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('wheels');
  const [timelineIndex, setTimelineIndex] = useState<number>(2);
  const [xrayMode, setXrayMode] = useState<boolean>(false);

  // Right Panel Tab ('science' | 'chat')
  const [rightTab, setRightTab] = useState<'science' | 'chat'>('science');

  // Audio, Voice (TTS) & Ping Telemetry State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    initialSaved.soundEnabled !== undefined ? initialSaved.soundEnabled : true
  );
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [pingActive, setPingActive] = useState<boolean>(false);
  const [pingTargetCatalogId, setPingTargetCatalogId] = useState<string | null>(null);
  const [pingBanner, setPingBanner] = useState<string | null>(null);

  // Persisted Student Progress (Quizzes + Catalog Exploration)
  const [solvedQuizzes, setSolvedQuizzes] = useState<Record<string, boolean>>(
    initialSaved.solvedQuizzes || {}
  );
  const [exploredIds, setExploredIds] = useState<Record<string, boolean>>(
    initialSaved.exploredIds || { 'cat-apollo15': true }
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Modals
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => Storage.getGeminiKey());
  const [hasGeminiKey, setHasGeminiKey] = useState(() => !!Storage.getGeminiKey());
  const [serverAiConnected, setServerAiConnected] = useState(false);
  const [liveAiVerified, setLiveAiVerified] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.protocol === 'file:') return;
    let alive = true;
    const ctrl = new AbortController();
    fetch('/api/ai', { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (alive) setServerAiConnected(data?.connected === true); })
      .catch(() => {});
    return () => { alive = false; ctrl.abort(); };
  }, []);

  // NASA Live Image API State
  const [nasaPhotos, setNasaPhotos] = useState<Array<{ title: string; url: string; date: string }>>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photosAreLive, setPhotosAreLive] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<{ title: string; url: string; date: string } | null>(null);

  // Black-Box AI Chat State (persisted)
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(
    (initialSaved.chatHistory as Record<string, ChatMessage[]>) || {}
  );
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Derived Current Relic & Hotspot
  const currentRelic: RelicItem = RELICS_DATA.find(r => r.id === selectedRelicId) || RELICS_DATA[0];
  const currentHotspot =
    currentRelic.hotspots.find(h => h.id === selectedHotspotId) || currentRelic.hotspots[0];
  const currentTimeline = currentRelic.timelineStates[timelineIndex] || currentRelic.timelineStates[2];

  // XP & Rank Calculations
  const solvedCount = Object.keys(solvedQuizzes).filter(k => solvedQuizzes[k]).length;
  const exploredCount = Object.keys(exploredIds).filter(k => exploredIds[k]).length;
  const totalXP = solvedCount * XP_PER_QUIZ + exploredCount * XP_PER_EXPLORE;
  const maxXP = RELICS_DATA.length * XP_PER_QUIZ + CATALOG_DATA.length * XP_PER_EXPLORE;
  const rank = getRank(totalXP);
  const nextRank = getNextRank(totalXP);

  // Persist progress to localStorage whenever state updates
  useEffect(() => {
    Storage.save({
      lang,
      soundEnabled,
      viewMode,
      selectedRegion,
      selectedRelicId,
      solvedQuizzes,
      exploredIds,
      chatHistory
    });
  }, [lang, soundEnabled, viewMode, selectedRegion, selectedRelicId, solvedQuizzes, exploredIds, chatHistory]);

  // Sync audio enabled flag
  useEffect(() => {
    SpaceAudio.setEnabled(soundEnabled);
    if (!soundEnabled) setAmbientEnabled(false);
  }, [soundEnabled]);

  // Cleanup TTS & ambient on unmount
  useEffect(() => {
    return () => {
      Narrator.stop();
      SpaceAudio.stopAmbient();
    };
  }, []);

  // Mark matching catalog entry explored when viewing a diagnostic relic
  useEffect(() => {
    const matchCat = CATALOG_DATA.find(c => c.deepId === selectedRelicId);
    if (matchCat) {
      setSelectedCatalogId(matchCat.id);
      if (!exploredIds[matchCat.id]) {
        setExploredIds(prev => ({ ...prev, [matchCat.id]: true }));
      }
    }
    setSelectedHotspotId(currentRelic.hotspots[0].id);
    setTimelineIndex(2);
    setSelectedAnswer(solvedQuizzes[currentRelic.id] ? currentRelic.quiz.correctIndex : null);
  }, [selectedRelicId]);

  // Fetch Real Historical Imagery from NASA Image and Video Library API
  useEffect(() => {
    let isMounted = true;
    const fetchNasaImages = async () => {
      setLoadingPhotos(true);
      try {
        const res = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(
            currentRelic.nasaQuery
          )}&media_type=image`
        );
        if (!res.ok) throw new Error('NASA API HTTP error');
        const data = await res.json();
        const items = data?.collection?.items || [];
        const parsed = items
          .slice(0, 4)
          .map((item: { data?: Array<{ title?: string; date_created?: string }>; links?: Array<{ href?: string }> }) => ({
            title: item.data?.[0]?.title || currentRelic.name.en,
            url: item.links?.[0]?.href || '',
            date: (item.data?.[0]?.date_created || '').slice(0, 10)
          }))
          .filter((img: { url: string }) => img.url);

        if (isMounted) {
          if (parsed.length > 0) {
            setNasaPhotos(parsed);
            setPhotosAreLive(true);
          } else {
            setNasaPhotos(currentRelic.fallbackImages);
            setPhotosAreLive(false);
          }
        }
      } catch {
        if (isMounted) {
          setNasaPhotos(currentRelic.fallbackImages);
          setPhotosAreLive(false);
        }
      } finally {
        if (isMounted) setLoadingPhotos(false);
      }
    };

    fetchNasaImages();
    return () => {
      isMounted = false;
    };
  }, [selectedRelicId]);

  // Text-to-Speech handler
  const handleToggleSpeak = (text: string, id: string) => {
    SpaceAudio.unlock();
    if (speakingId === id) {
      Narrator.stop();
      setSpeakingId(null);
      return;
    }
    if (!Narrator.supported()) {
      alert(
        lang === 'uz'
          ? 'Kechirasiz, ushbu brauzer ovozli o‘qish (Web Speech API) funksiyasini qo‘llab-quvvatlamaydi.'
          : 'Sorry, your browser does not support Web Speech synthesis.'
      );
      return;
    }
    setSpeakingId(id);
    Narrator.speak(text, lang, () => {
      setSpeakingId(prev => (prev === id ? null : prev));
    });
  };

  // Trigger Telemetry Sonar Ping (works for both Diagnostic relics and Map/Catalog items)
  const triggerPing = (name: string, status: 'ACTIVE' | 'PARTIAL' | 'OFFLINE', oneWaySec: number, catalogId?: string) => {
    SpaceAudio.unlock();
    const { returnAt } = SpaceAudio.sonar({ status, oneWaySeconds: oneWaySec });
    setPingActive(true);
    if (catalogId) setPingTargetCatalogId(catalogId);

    const delayText = formatLightTime(oneWaySec * 2, lang);
    setPingBanner(
      lang === 'uz'
        ? `📡 ${name} ga signal yuborildi! (2 tomonlama yorug‘lik vaqti: ${delayText})`
        : `📡 Pinging ${name}... (Round-trip light time: ${delayText})`
    );

    setTimeout(() => {
      const replyLabel =
        status === 'ACTIVE'
          ? lang === 'uz'
            ? '✅ JAVOB QABUL QILINDI: Qurilma 2026-yilda ham javob bermoqda!'
            : '✅ ECHO RECEIVED: Hardware responds (Active in 2026)!'
          : status === 'PARTIAL'
          ? lang === 'uz'
            ? '⚠️ ZAIF / PASSIV AKS-SADO: Ba’zi tizimlar saqlangan!'
            : '⚠️ WEAK / PASSIVE ECHO: Partial hardware intact!'
          : lang === 'uz'
          ? '🌑 JAVOB YO‘Q (Kosmik shovqin): Qurilma uyquda / quvvati tugagan.'
          : '🌑 NO CARRIER (Cosmic Static): Hardware dormant / power depleted.';
      setPingBanner(`${name} — ${replyLabel}`);
    }, Math.round(returnAt * 1000));

    setTimeout(() => {
      setPingActive(false);
      setPingTargetCatalogId(null);
    }, Math.round(returnAt * 1000) + 1800);
  };

  const handleDiagnosticPing = () => {
    const oneWay = currentRelic.distanceFromEarthKm / 299792.458;
    triggerPing(currentRelic.name[lang], currentRelic.status, oneWay);
  };

  const handleCatalogPing = (item: CatalogItem) => {
    triggerPing(item.name[lang], item.status, itemLightSeconds(item), item.id);
  };

  // Toggle Space Ambient Drone
  const handleToggleAmbient = () => {
    SpaceAudio.unlock();
    if (ambientEnabled) {
      SpaceAudio.stopAmbient();
      setAmbientEnabled(false);
    } else {
      if (!soundEnabled) setSoundEnabled(true);
      SpaceAudio.setEnabled(true);
      SpaceAudio.startAmbient();
      setAmbientEnabled(true);
    }
  };

  // Switch Region Handler
  const handleSelectRegion = (region: 'moon' | 'mars' | 'deepspace') => {
    setSelectedRegion(region);
    const firstInRegion = RELICS_DATA.find(r => r.region === region);
    if (firstInRegion) {
      setSelectedRelicId(firstInRegion.id);
    }
    SpaceAudio.hardware(firstInRegion?.id || '');
    SpaceAudio.blip();
  };

  // Select Catalog Item (on Map / Catalog) & award +50 XP once
  const handleSelectCatalogItem = (item: CatalogItem) => {
    setSelectedCatalogId(item.id);
    if (!exploredIds[item.id]) {
      setExploredIds(prev => ({ ...prev, [item.id]: true }));
      SpaceAudio.xp();
    }
  };

  const handleOpenDeepDiagnostic = (deepId: string) => {
    const found = RELICS_DATA.find(r => r.id === deepId);
    if (found) {
      setSelectedRegion(found.region);
      setSelectedRelicId(found.id);
      setViewMode('diagnostic');
      SpaceAudio.hardware(found.id);
      SpaceAudio.whoosh();
    }
  };

  const handleViewOnMap = (item: CatalogItem) => {
    handleSelectCatalogItem(item);
    setViewMode('map');
    SpaceAudio.whoosh();
  };

  // Handle Quiz Option Selection
  const handleQuizAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    if (idx === currentRelic.quiz.correctIndex) {
      SpaceAudio.success();
      setSolvedQuizzes(prev => ({ ...prev, [currentRelic.id]: true }));
    } else {
      SpaceAudio.error();
    }
  };

  // Grounded Offline Fallback Knowledge Builder (uses ONLY verified RELICS_DATA + CATALOG_DATA)
  const buildGroundedFallback = (question: string): string => {
    const q = question.toLowerCase();

    // Check if user asks about another spacecraft from the 29-relic catalog
    const mentionedOther = CATALOG_DATA.find(
      c =>
        c.deepId !== currentRelic.id &&
        (q.includes(c.name.en.toLowerCase().split(' ')[0]) ||
          q.includes(c.name.uz.toLowerCase().split(' ')[0]) ||
          (c.id.includes('viking') && q.includes('viking')) ||
          (c.id.includes('curiosity') && q.includes('curiosity')) ||
          (c.id.includes('perseverance') && q.includes('perseverance')) ||
          (c.id.includes('insight') && q.includes('insight')) ||
          (c.id.includes('spirit') && q.includes('spirit')) ||
          (c.id.includes('sojourner') && q.includes('sojourner')) ||
          (c.id.includes('cassini') && q.includes('cassini')))
    );
    if (mentionedOther) {
      return lang === 'uz'
        ? `🛰️ Men katalogimizdagi ${mentionedOther.name.uz} (${mentionedOther.year}) haqida bilaman: u ${mentionedOther.site.uz} hududida joylashgan. ${mentionedOther.story.uz} ${mentionedOther.fact.uz}`
        : `🛰️ From our verified NASA catalog, here is what I know about ${mentionedOther.name.en} (${mentionedOther.year}) at ${mentionedOther.site.en}: ${mentionedOther.story.en} ${mentionedOther.fact.en}`;
    }

    // Check hotspot keywords
    const matchedHotspot = currentRelic.hotspots.find(
      h =>
        q.includes(h.id) ||
        h.name.en
          .toLowerCase()
          .split(/\s+/)
          .some(w => w.length > 4 && q.includes(w)) ||
        h.name.uz
          .toLowerCase()
          .split(/\s+/)
          .some(w => w.length > 4 && q.includes(w))
    );
    if (matchedHotspot) {
      return `⚙️ [${matchedHotspot.name[lang]} — ${matchedHotspot.health2026}%]: ${matchedHotspot.engineering[lang]} 🔬 ${matchedHotspot.science[lang]}`;
    }

    if (q.includes('kashfiyot') || q.includes('discover') || q.includes('science') || q.includes('fan') || q.includes('nima berdi')) {
      return `🔬 ${currentRelic.scienceSummary[lang]}`;
    }
    if (q.includes('qayer') || q.includes('where') || q.includes('location') || q.includes('masofa') || q.includes('distance') || q.includes('uzoq')) {
      return lang === 'uz'
        ? `📍 Mening joylashuvim: ${currentRelic.location.uz}. Yerdan ma’lumotnomaviy masofam ~${currentRelic.distanceFromEarthKm.toLocaleString()} km (${currentRelic.signalDelayText.uz}).`
        : `📍 My verified location is ${currentRelic.location.en}, at a reference distance of ~${currentRelic.distanceFromEarthKm.toLocaleString()} km (${currentRelic.signalDelayText.en}).`;
    }
    if (
      q.includes('2026') ||
      q.includes('holat') ||
      q.includes('ishla') ||
      q.includes('work') ||
      q.includes('status') ||
      q.includes('alive') ||
      q.includes('tirik')
    ) {
      const partsSummary = currentRelic.hotspots
        .map(h => `${h.name[lang]} (${h.health2026}%)`)
        .join('; ');
      return lang === 'uz'
        ? `📡 Mening 2026-yilgi holatim: ${currentRelic.statusLabel.uz}. ${currentRelic.timelineStates[2].log.uz} Qismlarim: ${partsSummary}.`
        : `📡 My 2026 status: ${currentRelic.statusLabel.en}. ${currentRelic.timelineStates[2].log.en} Components: ${partsSummary}.`;
    }
    if (q.includes('xabar') || q.includes('astronavt') || q.includes('message') || q.includes('future') || q.includes('kelajak')) {
      return lang === 'uz'
        ? `🚀 Kelajak astronavtlari va yosh muhandislariga xabarim: ${currentRelic.firstPersonIntro.uz} Mening tajribam kelajak missiyalariga yo‘l ochdi!`
        : `🚀 My message to future explorers: ${currentRelic.firstPersonIntro.en} What we engineered paved the way for Artemis and future missions!`;
    }
    if (q.includes('ob-havo') || q.includes('weather') || q.includes('bugun') || q.includes('today') || q.includes('hozirgi harorat')) {
      return lang === 'uz'
        ? `ℹ️ Eslatma: Men hozir jonli real-vaqt NASA telemetriya kanaliga ulanmaganman (API kalitsiz oflayn arxiv rejimidasiz). Biroq mening tasdiqlangan ma’lumotlar bazam bo‘yicha o‘rtacha sirt harorati ${currentRelic.timelineStates[2].temp} atrofida. Batafsil: ${currentRelic.timelineStates[2].log.uz}`
        : `ℹ️ Transparency note: I am currently running in offline verified-archive mode (no live DSN telemetry stream or Gemini key active). From verified mission reference records, my environment temperature is around ${currentRelic.timelineStates[2].temp}. ${currentRelic.timelineStates[2].log.en}`;
    }

    return lang === 'uz'
      ? `🛰️ [${currentRelic.name.uz} — NASA arxiv AI]: Men hozir tekshirilgan NASA arxiv ma’lumotlari asosida javob beryapman. ${currentHotspot.name.uz} holati ${currentHotspot.health2026}%: ${currentHotspot.engineering.uz}`
      : `🛰️ [${currentRelic.name.en} — NASA archive AI]: I am currently answering from verified NASA archive records. ${currentHotspot.name.en} is at ${currentHotspot.health2026}% condition: ${currentHotspot.engineering.en}`;
  };

  // Send Black-Box AI Chat Message (Live Gemini API if key present, else Honest Grounded Archive)
  const handleSendChatMessage = async (customQuestion?: string) => {
    const questionText = (customQuestion || chatInput).trim();
    if (!questionText || isAiTyping) return;

    SpaceAudio.unlock();
    const currentMessages: ChatMessage[] = chatHistory[currentRelic.id] || [
      { role: 'model', text: currentRelic.firstPersonIntro[lang], source: 'archive' }
    ];

    const updatedMessages: ChatMessage[] = [...currentMessages, { role: 'user', text: questionText }];
    setChatHistory(prev => ({ ...prev, [currentRelic.id]: updatedMessages }));
    if (!customQuestion) setChatInput('');
    setIsAiTyping(true);
    SpaceAudio.blip();

    const apiKey = Storage.getGeminiKey();
    if (!apiKey && !serverAiConnected) {
      setTimeout(() => {
        const reply = buildGroundedFallback(questionText);
        setChatHistory(prev => ({
          ...prev,
          [currentRelic.id]: [...updatedMessages, { role: 'model', text: reply, source: 'archive' }]
        }));
        setIsAiTyping(false);
      }, 280);
      return;
    }

    try {
      // Netlify Function is preferred. It keeps the API key on the server.
      const apiUrl = serverAiConnected
        ? '/api/ai'
        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const systemPrompt = `You are the living "Black Box" educational AI persona of the NASA spacecraft "${currentRelic.name.en}" (${currentRelic.name.uz}), located at ${currentRelic.location.en}.
Speak in the FIRST PERSON ("I", "Men") with a warm, inspiring, clear tone suitable for school students and NASA Space Apps Challenge judges.
Respond in ${lang === 'uz' ? "Uzbek language (O'zbek tilida)" : 'English'}.
STRICT ACCURACY RULES:
1. Base all technical facts strictly on verified NASA history and these mission records. Never invent live telemetry, fake real-time readings, or unverified discoveries.
2. If asked for something you are uncertain about or that requires a live DSN telemetry feed (which is not connected), clearly state that you don't have live telemetry and share what is known from mission history.
3. Keep answers concise (2-5 sentences).

VERIFIED MISSION DATA:
- Launched: ${currentRelic.launchYear}, Mission end/status year: ${currentRelic.endYear}
- Reference distance: ~${currentRelic.distanceFromEarthKm.toLocaleString()} km (${currentRelic.signalDelayText.en})
- Status: ${currentRelic.statusLabel.en}
- Science unlocked: ${currentRelic.scienceSummary.en}
- Components: ${currentRelic.hotspots
        .map(h => `${h.name.en} (${h.health2026}% condition): ${h.engineering.en}`)
        .join(' | ')}`;

      const recentContents = updatedMessages.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: recentContents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.5, maxOutputTokens: 320 }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP ${response.status}`);
      }
      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) throw new Error('Empty Gemini response');
      setLiveAiVerified(true);

      setChatHistory(prev => ({
        ...prev,
        [currentRelic.id]: [...updatedMessages, { role: 'model', text: reply, source: 'gemini' }]
      }));
    } catch (err) {
      setLiveAiVerified(false);
      const notice =
        lang === 'uz'
          ? `⚠️ Gemini API javob bermadi (${err instanceof Error ? err.message : 'xato'}). Tekshirilgan arxivdan javob:\n`
          : `⚠️ Gemini API unavailable (${err instanceof Error ? err.message : 'error'}). Verified archive reply:\n`;
      setChatHistory(prev => ({
        ...prev,
        [currentRelic.id]: [
          ...updatedMessages,
          { role: 'model', text: notice + buildGroundedFallback(questionText), source: 'archive' }
        ]
      }));
    } finally {
      setIsAiTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  const activeMessages: ChatMessage[] = chatHistory[currentRelic.id] || [
    { role: 'model', text: currentRelic.firstPersonIntro[lang], source: 'archive' }
  ];

  const getStatusStyle = (status: string) => {
    if (status === 'ACTIVE')
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
    if (status === 'PARTIAL')
      return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    Storage.setGeminiKey(geminiKeyInput);
    setHasGeminiKey(!!geminiKeyInput.trim());
    setShowGeminiModal(false);
    SpaceAudio.success();
  };

  const handleResetProgress = () => {
    Storage.clear();
    setSolvedQuizzes({});
    setExploredIds({ 'cat-apollo15': true });
    setChatHistory({});
    setSelectedAnswer(null);
    SpaceAudio.blip();
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* ==================================================================== */}
      {/* TOP MISSION CONTROL HEADER                                           */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#071022]/92 backdrop-blur-md border-b border-cyan-500/25 px-3 sm:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              <Radar className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wider text-base sm:text-lg bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                  ECHO-RELIC // 2035
                </span>
                <span className="hidden md:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Challenge #14
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === 'uz'
                  ? 'Abandoned But Not Forgotten — Kosmosda qolgan qurilmalar xaritasi va 3D laboratoriyasi'
                  : 'Abandoned But Not Forgotten — Interactive Space Hardware Map, 3D Lab & Living Memory'}
              </p>
            </div>
          </div>

          {/* Primary 3-Mode Workspace Switcher */}
          <div className="flex items-center bg-slate-900/95 p-1 rounded-xl border border-slate-700/80">
            {[
              {
                id: 'diagnostic' as ViewMode,
                icon: Microscope,
                labelUz: '3D & Diagnostika',
                labelEn: '3D & Diagnostics',
                badge: '6'
              },
              {
                id: 'map' as ViewMode,
                icon: MapIcon,
                labelUz: 'Koinot Xaritasi',
                labelEn: 'Space Map',
                badge: '29'
              },
              {
                id: 'catalog' as ViewMode,
                icon: Layers,
                labelUz: 'Katalog',
                labelEn: 'Catalog',
                badge: `${CATALOG_DATA.length}`
              }
            ].map(tab => {
              const Icon = tab.icon;
              const active = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setViewMode(tab.id);
                    SpaceAudio.blip();
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? tab.labelUz : tab.labelEn}</span>
                  <span className="text-[10px] px-1.5 rounded-full bg-slate-950/60 text-cyan-200">
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Ping, XP Badge, Gemini Key, Pitch, Audio, Ambient, Language */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDiagnosticPing}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Radio className={`w-4 h-4 ${pingActive ? 'animate-ping text-emerald-200' : ''}`} />
              <span className="hidden sm:inline">{lang === 'uz' ? 'PING SIGNAL' : 'SEND PING'}</span>
            </button>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Space Relic Detective Badge & Progress"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{totalXP} XP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200">
                {rank.icon}
              </span>
            </button>

            <button
              onClick={() => setShowGeminiModal(true)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                (serverAiConnected || hasGeminiKey)
                  ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={lang === 'uz' ? 'Gemini AI API kalitini sozlash' : 'Configure Gemini API Key'}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">
                {liveAiVerified ? 'GEMINI LIVE' : (serverAiConnected || hasGeminiKey) ? 'AI ULANISH' : lang === 'uz' ? 'AI Kalit' : 'AI Key'}
              </span>
            </button>

            <button
              onClick={() => setShowPitchModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-bold flex items-center gap-1 transition-all"
              title="Hackathon Pitch Script & Architecture"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Pitch</span>
            </button>

            <button
              onClick={handleToggleAmbient}
              className={`p-2 rounded-xl border transition-all ${
                ambientEnabled
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
              title={lang === 'uz' ? 'Koinot fon tovushi' : 'Deep Space Ambient Sound'}
            >
              <Waves className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300"
              title={lang === 'uz' ? 'Ovoz effektlari' : 'Toggle Telemetry Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={() => {
                Narrator.stop();
                setSpeakingId(null);
                setLang(lang === 'uz' ? 'en' : 'uz');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Live Ping Telemetry Toast Banner */}
        {pingBanner && (
          <div className="max-w-[1600px] mx-auto mt-2 bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between shadow-lg">
            <span>{pingBanner}</span>
            <button
              onClick={() => setPingBanner(null)}
              className="text-emerald-300 hover:text-white text-[11px] ml-3"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* ==================================================================== */}
      {/* VIEW 1: DIAGNOSTIC & 3D WORKSPACE (6 FLAGSHIP RELICS)                */}
      {/* ==================================================================== */}
      {viewMode === 'diagnostic' && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT COLUMN (3 cols): REGION & RELIC SELECTOR */}
          <section className="lg:col-span-3 flex flex-col gap-3">
            <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  {lang === 'uz' ? '1. Hudud va Qurilma' : '1. Region & Relic'}
                </h2>
                <button
                  onClick={() => setViewMode('map')}
                  className="text-[10px] font-mono text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <MapIcon className="w-3 h-3" /> {lang === 'uz' ? 'Xaritada' : 'Map'}
                </button>
              </div>

              {/* 3 Region Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-3">
                {[
                  { id: 'moon' as const, labelUz: '🌙 Oy', labelEn: '🌙 Moon' },
                  { id: 'mars' as const, labelUz: '🔴 Mars', labelEn: '🔴 Mars' },
                  { id: 'deepspace' as const, labelUz: '🌌 Koinot', labelEn: '🌌 Space' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectRegion(tab.id)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedRegion === tab.id
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'uz' ? tab.labelUz : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* Cards for Relics in Current Region */}
              <div className="space-y-2.5">
                {RELICS_DATA.filter(r => r.region === selectedRegion).map(relic => {
                  const isSelected = relic.id === selectedRelicId;
                  const isQuizDone = solvedQuizzes[relic.id];
                  return (
                    <button
                      key={relic.id}
                      onClick={() => {
                        setSelectedRelicId(relic.id);
                        SpaceAudio.hardware(relic.id);
                        SpaceAudio.select();
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(
                            relic.status
                          )}`}
                        >
                          ● {relic.status}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isQuizDone && (
                            <span className="text-emerald-400 text-xs flex items-center gap-0.5 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" /> +250XP
                            </span>
                          )}
                          <span className="text-xs font-mono text-slate-400">{relic.launchYear}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-white leading-snug mb-1">
                        {relic.name[lang]}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
                        {relic.subtitle[lang]}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div className="bg-slate-950/60 px-2 py-1 rounded">
                          <span className="text-slate-500 block text-[9px] uppercase font-mono">
                            {lang === 'uz' ? 'Reja bo‘yicha' : 'Planned'}
                          </span>
                          <span className="text-slate-200 font-medium">{relic.plannedDuration[lang]}</span>
                        </div>
                        <div className="bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                          <span className="text-cyan-400 block text-[9px] uppercase font-mono">
                            {lang === 'uz' ? 'Amalda ishladi' : 'Actual Legacy'}
                          </span>
                          <span className="text-cyan-200 font-semibold">{relic.actualDuration[lang]}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick All-6 Relics Switcher Pills */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                  {lang === 'uz' ? '6 ta chuqur diagnostika apparati:' : 'Quick Jump (6 Deep Diagnostics):'}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {RELICS_DATA.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRegion(r.region);
                        setSelectedRelicId(r.id);
                        SpaceAudio.hardware(r.id);
                        SpaceAudio.select();
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium truncate flex items-center justify-between border ${
                        r.id === selectedRelicId
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{r.name.en.split(' ')[0]} {r.name.en.split(' ')[1]}</span>
                      {solvedQuizzes[r.id] ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            r.status === 'ACTIVE'
                              ? 'bg-emerald-400'
                              : r.status === 'PARTIAL'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Honest Reference Trajectory & Distance Box */}
            <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  {lang === 'uz' ? 'Ma’lumotnomaviy Masofa' : 'Reference Distance'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  NASA NSSDCA REF
                </span>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {lang === 'uz' ? 'Yerdan o‘rtacha / epoxa masofasi:' : 'Reference Distance from Earth:'}
                </div>
                <div className="text-base font-mono font-bold text-cyan-300 tracking-tight mt-0.5">
                  {currentRelic.distanceFromEarthKm.toLocaleString()} km
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{currentRelic.signalDelayText[lang]}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-900/70 rounded-xl p-2.5 border border-slate-800/80">
                <span className="text-slate-500 font-mono uppercase text-[10px] block">
                  {lang === 'uz' ? 'Joylashuv koordinatasi:' : 'Coordinates / Sector:'}
                </span>
                {currentRelic.location[lang]}
              </div>
            </div>
          </section>

          {/* CENTER STAGE (5 cols): 3D MODEL + X-RAY BLUEPRINT + TIME SLIDER */}
          <section className="lg:col-span-5 flex flex-col gap-3">
            <div className="bg-[#081226] border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-col relative overflow-hidden">
              {/* Scanner Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 z-10">
                <div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(
                      currentRelic.status
                    )}`}
                  >
                    {currentRelic.statusLabel[lang]}
                  </span>
                  <h1 className="text-base sm:text-lg font-black text-white mt-1">
                    {currentRelic.name[lang]}
                  </h1>
                </div>

                {/* Stage View Switcher (3D 360° vs X-Ray Blueprint) + X-Ray + TTS */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => {
                        setCenterStageMode('3d');
                        SpaceAudio.blip();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 ${
                        centerStageMode === '3d'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" /> 3D 360°
                    </button>
                    <button
                      onClick={() => {
                        setCenterStageMode('blueprint');
                        SpaceAudio.blip();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 ${
                        centerStageMode === 'blueprint'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" /> {lang === 'uz' ? 'Sxema' : 'Blueprint'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setXrayMode(!xrayMode);
                      SpaceAudio.blip();
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border flex items-center gap-1 transition-all ${
                      xrayMode
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{xrayMode ? 'X-RAY' : 'SOLID'}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleToggleSpeak(
                        `${currentRelic.name[lang]}. ${currentRelic.firstPersonIntro[lang]} ${currentRelic.scienceSummary[lang]}`,
                        `relic-${currentRelic.id}`
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition-all ${
                      speakingId === `relic-${currentRelic.id}`
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
                    }`}
                    title={lang === 'uz' ? 'Hikoyani ovozli eshitish' : 'Listen to spacecraft story'}
                  >
                    {speakingId === `relic-${currentRelic.id}` ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">
                      {speakingId === `relic-${currentRelic.id}`
                        ? 'Stop'
                        : lang === 'uz'
                        ? 'Ovoz'
                        : 'Listen'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Instruction Banner */}
              <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between text-xs text-cyan-200">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {centerStageMode === '3d'
                    ? lang === 'uz'
                      ? '3D modelni aylantiring va pastdagi 4 ta qism tugmasi orqali diagnostika qiling!'
                      : 'Orbit the 3D spacecraft and inspect the 4 hardware subsystems below!'
                    : lang === 'uz'
                    ? 'Qurilma ustidagi 4 ta miltillovchi nuqtani bosing va ichki qismlarini tekshiring!'
                    : 'Click the 4 pulsing hardware nodes on the blueprint to inspect functionality!'}
                </span>
                <span className="font-mono text-[10px] text-cyan-400 shrink-0 ml-2">
                  {currentTimeline.year} VIEW
                </span>
              </div>

              {/* Interactive Viewport: 3D Model OR 2D X-Ray Blueprint */}
              <div className="relative w-full aspect-[16/9] bg-[#040914] rounded-xl border border-slate-800 overflow-hidden">
                {centerStageMode === '3d' ? (
                  <Spacecraft3DViewer
                    relicId={currentRelic.id}
                    xrayMode={xrayMode}
                    dustLevel={currentTimeline.dust}
                    timelineYear={currentTimeline.year}
                    pingWave={pingActive}
                    fallbackImageUrl={currentRelic.fallbackImages[0]?.url}
                    fallbackTitle={currentRelic.fallbackImages[0]?.title}
                    lang={lang}
                  />
                ) : (
                  <>
                    <SpacecraftBlueprintSVG
                      relicId={currentRelic.id}
                      xrayMode={xrayMode}
                      dustLevel={currentTimeline.dust}
                      activeHotspotId={selectedHotspotId}
                      pingWave={pingActive}
                    />
                    {currentRelic.hotspots.map((spot, idx) => {
                      const isSelected = spot.id === selectedHotspotId;
                      const dotColor =
                        spot.statusType === 'ACTIVE'
                          ? 'bg-emerald-400 border-emerald-200'
                          : spot.statusType === 'PARTIAL'
                          ? 'bg-amber-400 border-amber-200'
                          : 'bg-rose-500 border-rose-200';

                      return (
                        <button
                          key={spot.id}
                          onClick={() => {
                            setSelectedHotspotId(spot.id);
                            SpaceAudio.blip();
                          }}
                          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                          className="-translate-x-1/2 -translate-y-1/2 absolute z-20 group focus:outline-none"
                        >
                          <span
                            className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                              isSelected ? 'bg-cyan-400' : dotColor.split(' ')[0]
                            }`}
                          />
                          <div
                            className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-xs font-black transition-transform ${
                              isSelected
                                ? 'scale-125 bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#22d3ee]'
                                : `${dotColor} text-slate-950 hover:scale-110`
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div
                            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-slate-950/95 border border-cyan-500/40 text-[10px] font-mono whitespace-nowrap transition-opacity ${
                              isSelected ? 'opacity-100 text-cyan-300' : 'opacity-0 group-hover:opacity-100 text-slate-200'
                            }`}
                          >
                            {spot.name[lang].slice(0, 28)} ({spot.health2026}%)
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* 4 Hotspot Quick Selector Pills (accessible in both 3D & Blueprint modes) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5">
                {currentRelic.hotspots.map((spot, idx) => {
                  const isSel = spot.id === selectedHotspotId;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => {
                        setSelectedHotspotId(spot.id);
                        SpaceAudio.blip();
                      }}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono truncate text-left flex items-center gap-1.5 transition-all ${
                        isSel
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-cyan-400 font-black">#{idx + 1}</span>
                      <span className="truncate">{spot.name[lang]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Hotspot Diagnostic Detail Box */}
              <div className="mt-2.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                      #{currentRelic.hotspots.findIndex(h => h.id === currentHotspot.id) + 1}
                    </span>
                    <h3 className="font-bold text-sm text-cyan-200">{currentHotspot.name[lang]}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleToggleSpeak(
                          `${currentHotspot.name[lang]}. ${currentHotspot.engineering[lang]} ${currentHotspot.science[lang]}`,
                          `spot-${currentHotspot.id}`
                        )
                      }
                      className="p-1 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 hover:border-cyan-400"
                      title={lang === 'uz' ? 'Qism haqida eshitish' : 'Read component info'}
                    >
                      {speakingId === `spot-${currentHotspot.id}` ? (
                        <Square className="w-3 h-3 fill-current text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        currentHotspot.health2026 > 70
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : currentHotspot.health2026 > 20
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {currentHotspot.health2026}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-2.5 border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentHotspot.health2026 > 70
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : currentHotspot.health2026 > 20
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-orange-500'
                    }`}
                    style={{ width: `${Math.max(4, currentHotspot.health2026)}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                      ⚙️ {lang === 'uz' ? 'Muhandislik Diagnostikasi' : 'Engineering Status'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{currentHotspot.engineering[lang]}</p>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
                      🔬 {lang === 'uz' ? 'Ilmiy Kashfiyot' : 'Science Unlocked'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{currentHotspot.science[lang]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIME & ENVIRONMENT DECAY SLIDER */}
            <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {lang === 'uz'
                    ? '2. Vaqt va Kosmik Muhit Slayderi'
                    : '2. Time-Lapse Environmental Decay'}
                </span>
                <span className="text-xs font-bold text-white bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  {currentTimeline.label[lang]}
                </span>
              </div>

              <div className="px-1 my-2">
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={1}
                  value={timelineIndex}
                  onChange={e => {
                    setTimelineIndex(Number(e.target.value));
                    SpaceAudio.blip();
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  {currentRelic.timelineStates.map((st, idx) => (
                    <button
                      key={st.year}
                      onClick={() => {
                        setTimelineIndex(idx);
                        SpaceAudio.blip();
                      }}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        timelineIndex === idx
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'hover:text-slate-200'
                      }`}
                    >
                      {idx === 0
                        ? `${st.year} (${lang === 'uz' ? 'Uchirish' : 'Launch'})`
                        : idx === 1
                        ? `${st.year} (${lang === 'uz' ? 'O‘rta' : 'Mid'})`
                        : `${st.year} (${lang === 'uz' ? 'Hozir' : 'Present'})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2.5">
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                  <BatteryCharging className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'uz' ? 'Energiya' : 'Power'}
                  </div>
                  <div className="text-sm font-mono font-bold text-emerald-300">
                    {currentTimeline.power}%
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                  <Layers className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'uz' ? 'Chang / Eroziya' : 'Dust / Wear'}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {currentTimeline.dust}%
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                  <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto mb-0.5" />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'uz' ? 'Radiatsiya' : 'Radiation'}
                  </div>
                  <div className="text-sm font-mono font-bold text-rose-300">
                    {currentTimeline.radiation} krad
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
                  <Thermometer className="w-4 h-4 text-cyan-400 mx-auto mb-0.5" />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang === 'uz' ? 'Harorat' : 'Temp'}
                  </div>
                  <div className="text-sm font-mono font-bold text-cyan-300">
                    {currentTimeline.temp}
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80 font-mono">
                📋 {currentTimeline.log[lang]}
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN (4 cols): SCIENCE + QUIZ & BLACK-BOX AI STORYTELLER */}
          <section className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-[#09152b]/90 border border-slate-800 rounded-2xl p-3.5 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-3">
                <button
                  onClick={() => {
                    setRightTab('science');
                    SpaceAudio.blip();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    rightTab === 'science'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Microscope className="w-4 h-4" />
                  <span>{lang === 'uz' ? 'Ilmiy Meros va Viktorina' : 'Science & Quiz'}</span>
                </button>
                <button
                  onClick={() => {
                    setRightTab('chat');
                    SpaceAudio.blip();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    rightTab === 'chat'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === 'uz' ? 'Qora Quti AI Suhbat' : 'Black-Box AI Chat'}</span>
                </button>
              </div>

              {rightTab === 'science' ? (
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  {/* Science Discovery Story Card with TTS */}
                  <div className="bg-gradient-to-br from-cyan-950/50 to-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-300">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        {lang === 'uz'
                          ? 'Insoniyatga nima berdi?'
                          : 'Science Made Possible'}
                      </div>
                      <button
                        onClick={() => handleToggleSpeak(currentRelic.scienceSummary[lang], `sci-${currentRelic.id}`)}
                        className="px-2 py-0.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-[11px] font-bold text-cyan-200 flex items-center gap-1"
                      >
                        {speakingId === `sci-${currentRelic.id}` ? (
                          <Square className="w-3 h-3 fill-current text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{lang === 'uz' ? 'Eshitish' : 'Read'}</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {currentRelic.scienceSummary[lang]}
                    </p>
                  </div>

                  {/* Live NASA Image & Video Library API Gallery */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase text-slate-300 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        {lang === 'uz'
                          ? 'NASA Arxiv Suratlari'
                          : 'NASA Image Library'}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          photosAreLive ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-300 bg-amber-500/10'
                        }`}
                      >
                        {photosAreLive ? 'LIVE API' : 'VERIFIED CACHE'}
                      </span>
                    </div>

                    {loadingPhotos ? (
                      <div className="h-24 flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
                        {lang === 'uz' ? 'NASA suratlari yuklanmoqda...' : 'Fetching NASA Mission Imagery...'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {nasaPhotos.slice(0, 2).map((photo, i) => (
                          <button
                            key={i}
                            onClick={() => setActivePhotoModal(photo)}
                            className="group relative h-24 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all text-left"
                          >
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={e => {
                                const fb = currentRelic.fallbackImages[i]?.url || currentRelic.fallbackImages[0]?.url;
                                if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-1.5 flex flex-col justify-end">
                              <span className="text-[10px] text-white font-medium line-clamp-1">
                                {photo.title}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interactive "Space Relic Detective" Engineering Quiz */}
                  <div className="bg-slate-900/95 border border-amber-500/40 rounded-xl p-3.5 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold uppercase text-amber-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        {lang === 'uz'
                          ? `Viktorina (+${XP_PER_QUIZ} XP)`
                          : `Detective Quiz (+${XP_PER_QUIZ} XP)`}
                      </span>
                      {solvedQuizzes[currentRelic.id] && (
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                          ✓ {lang === 'uz' ? 'YECHILDI' : 'SOLVED'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-white mb-2.5">
                      {currentRelic.quiz.question[lang]}
                    </p>

                    <div className="space-y-2">
                      {currentRelic.quiz.options.map((opt, idx) => {
                        const isPicked = selectedAnswer === idx;
                        const isCorrect = idx === currentRelic.quiz.correctIndex;
                        let btnStyle =
                          'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600';
                        if (selectedAnswer !== null) {
                          if (isCorrect) {
                            btnStyle =
                              'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-medium';
                          } else if (isPicked && !isCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="font-mono font-bold text-cyan-400 shrink-0">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{opt[lang]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswer !== null && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-lg text-xs border ${
                          selectedAnswer === currentRelic.quiz.correctIndex
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                            : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        }`}
                      >
                        {currentRelic.quiz.explanation[lang]}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* TAB 2: BLACK-BOX AI FIRST-PERSON STORYTELLER */
                <div className="flex-1 flex flex-col h-[540px]">
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 mb-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="text-xs font-mono font-bold text-emerald-300 truncate">
                        {currentRelic.name[lang]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setShowGeminiModal(true)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          hasGeminiKey
                            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                            : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                        }`}
                      >
                        {liveAiVerified ? 'GEMINI LIVE' : 'AI READY'}
                      </button>
                      <button
                        onClick={() => {
                          setChatHistory(prev => {
                            const next = { ...prev };
                            delete next[currentRelic.id];
                            return next;
                          });
                        }}
                        className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                        title={lang === 'uz' ? 'Suhbatni tozalash' : 'Reset chat'}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 bg-slate-950/70 rounded-xl p-3 border border-slate-800">
                    {activeMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-cyan-600 text-white rounded-br-none'
                              : 'bg-slate-900 border border-emerald-500/30 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {msg.role === 'model' && (
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                🤖 {currentRelic.name[lang]}
                              </span>
                              <button
                                onClick={() => handleToggleSpeak(msg.text, `chat-${currentRelic.id}-${i}`)}
                                className="text-slate-400 hover:text-cyan-300"
                                title={lang === 'uz' ? 'Ovozli o‘qish' : 'Speak'}
                              >
                                {speakingId === `chat-${currentRelic.id}-${i}` ? (
                                  <Square className="w-3 h-3 fill-current text-rose-400" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                          <div className="whitespace-pre-line">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="text-xs font-mono text-emerald-400 animate-pulse px-2">
                        📡 {lang === 'uz' ? 'Javob tayyorlanmoqda...' : 'Decoding transmission...'}
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick-Ask Pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {[
                      lang === 'uz'
                        ? '🔬 Eng katta kashfiyoting nima?'
                        : '🔬 What was your biggest discovery?',
                      lang === 'uz'
                        ? '⚙️ 2026-yilda qaysi qisming ishlayapti?'
                        : '⚙️ Which parts still work in 2026?',
                      lang === 'uz'
                        ? '🚀 Kelajak astronavtlariga xabaring?'
                        : '🚀 Message for future astronauts?'
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChatMessage(q)}
                        className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-200 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="mt-2.5 flex gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder={
                        lang === 'uz'
                          ? `${currentRelic.name.uz.split(' ')[0]} ga istalgan savol yozing...`
                          : `Ask ${currentRelic.name.en} anything...`
                      }
                      className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isAiTyping}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-xs font-bold flex items-center gap-1 hover:opacity-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: INTERACTIVE MOON / MARS / DEEP SPACE MAP                     */}
      {/* ==================================================================== */}
      {viewMode === 'map' && (
        <main className="flex-1">
          <InteractiveMapView
            lang={lang}
            selectedCatalogId={selectedCatalogId}
            onSelectCatalogItem={handleSelectCatalogItem}
            onOpenDeepDiagnostic={handleOpenDeepDiagnostic}
            onPingCatalogItem={handleCatalogPing}
            onToggleSpeak={handleToggleSpeak}
            speakingId={speakingId}
            pingTargetId={pingTargetCatalogId}
            exploredIds={exploredIds}
            onOpenPhotoModal={setActivePhotoModal}
          />
        </main>
      )}

      {/* ==================================================================== */}
      {/* VIEW 3: FULL 29-RELIC SEARCHABLE CATALOG                             */}
      {/* ==================================================================== */}
      {viewMode === 'catalog' && (
        <main className="flex-1">
          <CatalogView
            lang={lang}
            exploredIds={exploredIds}
            speakingId={speakingId}
            onToggleSpeak={handleToggleSpeak}
            onViewOnMap={handleViewOnMap}
            onOpenDeepDiagnostic={handleOpenDeepDiagnostic}
            onPingCatalogItem={handleCatalogPing}
          />
        </main>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: SPACE RELIC DETECTIVE CERTIFICATE & PERSISTED PROGRESS      */}
      {/* ==================================================================== */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b172e] border-2 border-amber-400/60 rounded-2xl max-w-lg w-full p-6 text-center relative shadow-[0_0_50px_rgba(245,158,11,0.25)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-3 text-3xl">
              {rank.icon}
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
              NASA Space Apps Challenge // {lang === 'uz' ? 'Unvon va Natija' : 'Rank & Progress'}
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {rank[lang]}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {lang === 'uz'
                ? 'Natijalar brauzeringiz xotirasida (localStorage) avtomatik saqlanadi.'
                : 'Your XP, quizzes, and explored relics are automatically saved in localStorage.'}
            </p>

            <div className="my-4 bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-3xl font-mono font-black text-amber-300">
                  {totalXP} / {maxXP} XP
                </div>
                {nextRank && (
                  <div className="text-[11px] font-mono text-cyan-300 mt-1">
                    {lang === 'uz'
                      ? `Keyingi unvon (${nextRank.uz}) uchun yana ${nextRank.min - totalXP} XP kerak`
                      : `${nextRank.min - totalXP} XP needed for ${nextRank.en}`}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-mono uppercase">
                    {lang === 'uz' ? 'Viktorinalar' : 'Quizzes'}
                  </div>
                  <div className="font-mono font-bold text-emerald-300 text-base">
                    {solvedCount} / {RELICS_DATA.length}
                  </div>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-mono uppercase">
                    {lang === 'uz' ? 'O‘rganilgan apparat' : 'Catalog Explored'}
                  </div>
                  <div className="font-mono font-bold text-cyan-300 text-base">
                    {exploredCount} / {CATALOG_DATA.length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {RELICS_DATA.map(r => (
                  <div
                    key={r.id}
                    className={`p-2 rounded-lg border text-[11px] font-mono ${
                      solvedQuizzes[r.id]
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {solvedQuizzes[r.id] ? '★ ' : '○ '}
                    {r.name.en.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResetProgress}
                className="px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'uz' ? 'Tozalash' : 'Reset'}</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                {lang === 'uz' ? 'Tadqiqotni davom ettirish' : 'Continue Mission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: GEMINI API KEY SETTINGS                                     */}
      {/* ==================================================================== */}
      {showGeminiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09152b] border border-cyan-400/50 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowGeminiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase mb-1">
              <KeyRound className="w-4 h-4" />
              {lang === 'uz' ? 'Jonli Gemini AI Sozlamasi' : 'Live Gemini AI Configuration'}
            </div>
            <h2 className="text-lg font-black text-white mb-2">
              {lang === 'uz' ? 'Qora Quti AI Chatni ulash' : 'Connect Live Gemini API'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {lang === 'uz'
                ? 'Demo NASA arxiv AI bilan darhol ishlaydi. Agar jonli Gemini javoblari kerak bo‘lsa, serverda GEMINI_API_KEY o‘rnating yoki o‘zingizning shaxsiy kalitingizni kiriting. Ommaviy qurilmaga maxfiy kalit kiritmang.'
                : 'The demo already works with the built-in NASA archive AI. For live Gemini responses, set GEMINI_API_KEY on the server or enter your private key. Do not enter secrets on shared devices.'}
            </p>

            {serverAiConnected && <p className="mb-2 text-xs text-emerald-300 font-bold">✅ Gemini AI server orqali ulangan</p>}
            <form onSubmit={handleSaveGeminiKey} className="space-y-3">
              <input
                type="password"
                value={geminiKeyInput}
                onChange={e => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
              <div className="flex gap-2">
                {hasGeminiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeminiKeyInput('');
                      Storage.setGeminiKey('');
                      setHasGeminiKey(false);
                      setShowGeminiModal(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold"
                  >
                    {lang === 'uz' ? 'Uzish' : 'Clear'}
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase"
                >
                  {lang === 'uz' ? 'Saqlash' : 'Save Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: HACKATHON JUDGE PITCH & ARCHITECTURE                        */}
      {/* ==================================================================== */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09152b] border border-cyan-400/50 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPitchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <span className="text-xs font-mono uppercase text-cyan-400">
              NASA Space Apps Challenge #14 — Abandoned But Not Forgotten
            </span>
            <h2 className="text-xl font-black text-white mt-1 mb-3">
              ECHO-RELIC // 2035 — v2.0 Architecture
            </h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="font-bold text-cyan-300 mb-1">
                  1. 5 Key Upgrades Completed for Students & Judges
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Interactive Moon, Mars & Deep Space Map + 3D Globe</strong> powered by NASA LROC & Viking mosaics with 29 clickable NASA relics.</li>
                  <li><strong>Real 360° 3D Spacecraft Models (Three.js)</strong> + X-Ray Diagnostic Blueprints for 6 flagship missions.</li>
                  <li><strong>Web Audio Sonar Ping & Web Speech Narrator (UZ/EN)</strong> so students hear light-time radar echoes and spoken stories.</li>
                  <li><strong>Honest Grounded AI + Optional Live Gemini 2.5 Flash</strong> that never invents fake telemetry.</li>
                  <li><strong>Persistent localStorage XP, Ranks & Quizzes</strong> across page reloads.</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="font-bold text-emerald-300 mb-1">
                  2. Verified Data Sources
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>NASA Image and Video Library API</strong> (<code>images-api.nasa.gov</code>) for live archival mission photography.</li>
                  <li><strong>NASA LROC & Viking MDIM 2.1</strong> global surface mosaics for Moon and Mars landing coordinates.</li>
                  <li><strong>NASA NSSDCA Mission Archives</strong> for verified launch/end years, landing sites, and engineering history.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: NASA PHOTO LIGHTBOX                                         */}
      {/* ==================================================================== */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <img
              src={activePhotoModal.url}
              alt={activePhotoModal.title}
              className="w-full max-h-[65vh] object-contain bg-black"
            />
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-white">{activePhotoModal.title}</h4>
                <span className="text-xs font-mono text-cyan-400">
                  NASA Official Archive • {activePhotoModal.date || 'Verified'}
                </span>
              </div>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 shrink-0"
              >
                {lang === 'uz' ? 'Yopish' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
