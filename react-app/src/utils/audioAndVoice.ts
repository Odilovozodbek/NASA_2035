// ============================================================================
// v2.0 — SPACE AUDIO ENGINE (Web Audio API) + NARRATOR (Web Speech API TTS)
// ============================================================================

export const SpaceAudio = (() => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let echoBus: GainNode | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let ambient: { out: GainNode; sources: AudioScheduledSourceNode[]; timer: ReturnType<typeof setInterval> } | null = null;
  let enabled = true;

  const ensure = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    try {
      if (!ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        master = ctx.createGain();
        master.gain.value = 0.85;
        master.connect(comp);
        comp.connect(ctx.destination);

        echoBus = ctx.createGain();
        const delay = ctx.createDelay(2);
        delay.delayTime.value = 0.34;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.45;
        const damp = ctx.createBiquadFilter();
        damp.type = 'lowpass';
        damp.frequency.value = 1900;
        echoBus.connect(delay);
        delay.connect(damp);
        damp.connect(feedback);
        feedback.connect(delay);
        damp.connect(master);

        const len = ctx.sampleRate * 2;
        noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  };

  const sendToEcho = (c: AudioContext, node: AudioNode, amount: number) => {
    if (amount <= 0 || !echoBus) return;
    const s = c.createGain();
    s.gain.value = amount;
    node.connect(s);
    s.connect(echoBus);
  };

  const tone = ({
    freq = 880,
    freqEnd = null as number | null,
    type = 'sine' as OscillatorType,
    at = 0,
    dur = 0.3,
    vol = 0.12,
    attack = 0.006,
    echo = 0,
    glide = null as number | null
  }) => {
    const c = ensure();
    if (!c || !enabled || !master) return;
    const t0 = c.currentTime + at;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + (glide || dur));
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    sendToEcho(c, g, echo);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  };

  const noise = ({
    at = 0,
    dur = 0.4,
    vol = 0.06,
    freq = 1800,
    q = 0.7,
    filter = 'bandpass' as BiquadFilterType,
    sweepTo = null as number | null,
    echo = 0
  }) => {
    const c = ensure();
    if (!c || !enabled || !noiseBuffer || !master) return;
    const t0 = c.currentTime + at;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = filter;
    f.frequency.setValueAtTime(freq, t0);
    f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.05, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    sendToEcho(c, g, echo);
    src.start(t0, Math.random());
    src.stop(t0 + dur + 0.05);
  };

  const radioStatic = (at: number, dur: number, vol = 0.05) => {
    noise({ at, dur, vol, freq: 2600, q: 0.6 });
    for (let i = 0; i < 8; i++) {
      noise({ at: at + Math.random() * dur, dur: 0.03, vol: vol * 1.8, freq: 2500 + Math.random() * 2500, q: 3 });
    }
  };

  const api = {
    setEnabled(v: boolean) {
      enabled = !!v;
      if (!enabled) api.stopAmbient();
    },
    unlock: () => ensure(),
    blip() {
      tone({ freq: 620, freqEnd: 930, type: 'triangle', dur: 0.14, vol: 0.07, glide: 0.06 });
    },
    // Original synthesised device cues, not alleged recordings of sound in vacuum.
    hardware(relicId: string) {
      if (relicId === 'ingenuity-heli') {
        noise({dur:.34,vol:.045,freq:950,sweepTo:1900,q:1.7});
        tone({freq:110,freqEnd:230,dur:.42,vol:.05,type:'sawtooth'});
      } else if (relicId === 'apollo-lrv' || relicId === 'opportunity-rover') {
        tone({freq:170,freqEnd:420,dur:.23,vol:.055,type:'triangle'});
        tone({freq:370,at:.09,dur:.13,vol:.035,type:'sine'});
      } else if (relicId === 'surveyor-lrrr') {
        tone({freq:480,dur:.07,vol:.045});
        tone({freq:680,at:.10,dur:.07,vol:.045});
      } else {
        tone({freq:1210,dur:.18,vol:.035,echo:.28});
        radioStatic(.14,.18,.012);
      }
    },
    select() {
      tone({ freq: 740, dur: 0.12, vol: 0.08 });
      tone({ freq: 1110, at: 0.07, dur: 0.22, vol: 0.07, echo: 0.25 });
    },
    success() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone({ freq: f, at: i * 0.08, dur: 0.45, vol: 0.09, echo: 0.2 })
      );
    },
    xp() {
      [880, 1174.66, 1760].forEach((f, i) =>
        tone({ freq: f, type: 'triangle', at: i * 0.06, dur: 0.25, vol: 0.06 })
      );
    },
    error() {
      tone({ freq: 196, freqEnd: 130, type: 'sawtooth', dur: 0.32, vol: 0.06 });
      tone({ freq: 185, type: 'square', at: 0.02, dur: 0.25, vol: 0.025 });
    },
    whoosh() {
      noise({ dur: 0.55, vol: 0.05, freq: 400, sweepTo: 3200, q: 1.2 });
    },
    sonar({ status = 'ACTIVE', oneWaySeconds = 1.28 }: { status?: string; oneWaySeconds?: number } = {}) {
      const returnAt = Math.min(3.2, 0.9 + Math.log10(1 + oneWaySeconds * 2) * 0.55);
      const c = ensure();
      if (!c || !enabled) return { returnAt };
      noise({ dur: 0.06, vol: 0.05, freq: 3500, q: 1 });
      tone({ freq: 1320, freqEnd: 1250, at: 0.02, dur: 1.6, vol: 0.2, attack: 0.004, echo: 0.55, glide: 0.4 });
      tone({ freq: 660, at: 0.02, dur: 0.9, vol: 0.05, echo: 0.3 });
      noise({ at: 0.35, dur: Math.max(0.3, returnAt - 0.3), vol: 0.012, freq: 1200, q: 0.4 });
      if (status === 'ACTIVE') {
        tone({ freq: 1250, at: returnAt, dur: 0.5, vol: 0.12, echo: 0.35 });
        tone({ freq: 1250, at: returnAt + 0.2, dur: 0.6, vol: 0.1, echo: 0.35 });
        radioStatic(returnAt, 0.4, 0.02);
      } else if (status === 'PARTIAL') {
        radioStatic(returnAt - 0.1, 0.7, 0.04);
        tone({ freq: 1180, at: returnAt + 0.1, dur: 0.7, vol: 0.05, echo: 0.5 });
      } else {
        radioStatic(returnAt - 0.1, 0.9, 0.05);
        tone({ freq: 220, freqEnd: 110, at: returnAt + 0.3, dur: 0.8, vol: 0.04 });
      }
      return { returnAt };
    },
    startAmbient() {
      const c = ensure();
      if (!c || !enabled || ambient || !master || !noiseBuffer) return;
      const out = c.createGain();
      out.gain.setValueAtTime(0.0001, c.currentTime);
      out.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 2.5);
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 420;
      lp.Q.value = 6;
      const lfo = c.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = c.createGain();
      lfoGain.gain.value = 220;
      lfo.connect(lfoGain);
      lfoGain.connect(lp.frequency);
      const sources: AudioScheduledSourceNode[] = [55, 55.35, 82.4, 110.2].map((f, i) => {
        const o = c.createOscillator();
        o.type = i < 2 ? 'sawtooth' : 'sine';
        o.frequency.value = f;
        const g = c.createGain();
        g.gain.value = i < 2 ? 0.35 : 0.18;
        o.connect(g);
        g.connect(lp);
        o.start();
        return o;
      });
      const n = c.createBufferSource();
      n.buffer = noiseBuffer;
      n.loop = true;
      const nf = c.createBiquadFilter();
      nf.type = 'bandpass';
      nf.frequency.value = 900;
      nf.Q.value = 0.3;
      const ng = c.createGain();
      ng.gain.value = 0.05;
      n.connect(nf);
      nf.connect(ng);
      ng.connect(lp);
      n.start();
      lp.connect(out);
      out.connect(master);
      sendToEcho(c, out, 0.3);
      lfo.start();
      const timer = setInterval(() => {
        if (Math.random() < 0.5) tone({ freq: 1800 + Math.random() * 900, dur: 0.09, vol: 0.015, echo: 0.6 });
      }, 3800);
      ambient = { out, sources: [...sources, lfo, n], timer };
    },
    stopAmbient() {
      if (!ambient) return;
      const { out, sources, timer } = ambient;
      ambient = null;
      clearInterval(timer);
      if (!ctx) return;
      const t = ctx.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(Math.max(0.0001, out.gain.value), t);
      out.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      sources.forEach(o => {
        try {
          o.stop(t + 0.9);
        } catch {
          /* already stopped */
        }
      });
    }
  };
  return api;
})();

export const Narrator = (() => {
  let token = 0;
  let ttsController: AbortController | null = null;
  let cloudContext: AudioContext | null = null;
  let cloudSource: AudioBufferSourceNode | null = null;

  const nativeSupported = () =>
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const supported = () => nativeSupported() || (typeof window !== 'undefined' && !!window.AudioContext);
  const normalizeSpeechText = (input: string, lang: 'uz'|'en') => {
    let t = String(input || '');
    const replacements: Array<[RegExp, string]> = lang === 'uz'
      ? [
          [/\bAI\b/gi, "sun'iy intellekt"],
          [/\bNASA\b/gi, 'Nasa'],
          [/\bRTG\b/gi, 'radioizotop termoelektr generator'],
          [/\bDSN\b/gi, 'Deep Space Network'],
          [/\bLRV\b/gi, 'Lunar Roving Vehicle'],
          [/\bLRRR\b/gi, 'laser retroreflektor'],
          [/\bMER-B\b/gi, 'Mars Exploration Rover B'],
          [/\bAPXS\b/gi, 'Alfa proton rentgen spektrometri'],
          [/\bCPU\b/gi, 'protsessor'],
          [/\bkm\b/gi, ' kilometr'],
          [/\b°C\b/gi, ' daraja selsiy'],
          [/~/g, ' taxminan '],
          [/\bVoyager\b/gi, 'Voyejer'],
          [/\bPioneer\b/gi, 'Payonir'],
          [/\bIngenuity\b/gi, 'Injenuiti'],
          [/\bOpportunity\b/gi, 'Opportyuniti']
        ]
      : [
          [/\bAI\b/gi, 'artificial intelligence'],
          [/\bRTG\b/gi, 'radioisotope thermoelectric generator'],
          [/\bDSN\b/gi, 'Deep Space Network'],
          [/\bLRV\b/gi, 'Lunar Roving Vehicle'],
          [/\bLRRR\b/gi, 'laser retroreflector'],
          [/\bMER-B\b/gi, 'Mars Exploration Rover B'],
          [/\bAPXS\b/gi, 'alpha particle X-ray spectrometer'],
          [/\bCPU\b/gi, 'processor'],
          [/\bkm\b/gi, ' kilometers'],
          [/\b°C\b/gi, ' degrees Celsius'],
          [/~/g, ' approximately ']
        ];
    replacements.forEach(([pattern, value]) => { t = t.replace(pattern, value); });
    return t;
  };
  const clean = (t: string, lang: 'uz'|'en' = 'en') => normalizeSpeechText(String(t || ''), lang)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[\[\]«»"]/g, '')
    .replace(/\s+/g, ' ').trim();
  const voices = () => nativeSupported() ? window.speechSynthesis.getVoices() || [] : [];
  const byPrefix = (prefix: string) => voices().find(v => v.lang.toLowerCase().replace('_','-').startsWith(prefix));
  const pickVoice = (lang: 'uz'|'en') => {
    if (lang === 'uz') {
      // Prefer real Uzbek first, then close phonetic fallbacks.
      return byPrefix('uz') || byPrefix('tr') || byPrefix('ru') || byPrefix('en') || null;
    }
    return voices().find(v => /^en[-_]US/i.test(v.lang) && /Natural|Premium|Google|Aria|Jenny|Samantha|Siri/i.test(v.name))
      || byPrefix('en') || null;
  };
  const chunks = (text: string, lang: 'uz'|'en') => {
    const cleaned = clean(text, lang);
    const sentenceParts = cleaned.match(/[^.!?]+[.!?]*/g) || [cleaned];
    const out: string[] = [];
    let buf = '';
    sentenceParts.forEach(part => {
      if ((buf + part).length > 190) {
        if (buf.trim()) out.push(buf.trim());
        buf = part;
      } else {
        buf += part;
      }
    });
    if (buf.trim()) out.push(buf.trim());
    return out;
  };
  const stop = () => {
    token += 1;
    ttsController?.abort();
    ttsController = null;
    try { cloudSource?.stop(); } catch { /* no active audio */ }
    cloudSource = null;
    if (nativeSupported()) window.speechSynthesis.cancel();
  };
  const speakNative = (text: string, lang: 'uz'|'en', current: number, onEnd?: () => void) => {
    if (!nativeSupported()) { onEnd?.(); return false; }
    const synth = window.speechSynthesis;
    const parts = chunks(text, lang);
    if (!parts.length) { onEnd?.(); return false; }
    const voice = pickVoice(lang);
    let index = 0;
    const advance = () => {
      if (current !== token) return;
      if (index >= parts.length) { onEnd?.(); return; }
      const u = new SpeechSynthesisUtterance(parts[index++]);
      if (voice) { u.voice = voice; u.lang = voice.lang; }
      else u.lang = lang === 'uz' ? 'uz-UZ' : 'en-US';
      u.rate = lang === 'uz' ? .86 : .93;
      u.pitch = 1.0;
      u.volume = .95;
      u.onend = advance;
      u.onerror = advance;
      synth.speak(u);
    };
    // Some mobile engines populate the voice list after the initial paint.
    if (!voices().length) {
      const pending = () => { if (current === token) advance(); };
      window.speechSynthesis.addEventListener('voiceschanged', pending, { once: true });
      window.setTimeout(() => { if (current === token && index === 0) advance(); }, 250);
    } else advance();
    return true;
  };
  const pcmToWav = (pcm: Uint8Array, sampleRate = 24000) => {
    const wav = new ArrayBuffer(44 + pcm.byteLength);
    const v = new DataView(wav);
    const str = (offset:number, value:string) => { for(let i=0;i<value.length;i++) v.setUint8(offset+i,value.charCodeAt(i)); };
    str(0,'RIFF'); v.setUint32(4,36+pcm.byteLength,true); str(8,'WAVE');
    str(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true);
    v.setUint16(22,1,true); v.setUint32(24,sampleRate,true);
    v.setUint32(28,sampleRate*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true);
    str(36,'data'); v.setUint32(40,pcm.byteLength,true);
    new Uint8Array(wav,44).set(pcm);
    return wav;
  };
  const playCloud = async (audioBase64: string, mimeType: string, current: number, onEnd?: () => void) => {
    const binary = atob(audioBase64);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    const isWav = /wav|wave/i.test(mimeType);
    const isPcm = /pcm|l16/i.test(mimeType);
    let sound: ArrayBuffer;
    if (isPcm && !isWav) {
      const sampleRate = Number(mimeType.match(/rate[=\/_-]?(\d+)/i)?.[1] || 24000);
      sound = pcmToWav(bytes, sampleRate);
    } else sound = bytes.buffer;
    if (current !== token) return;
    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) throw new Error('WebAudio not available');
    if (!cloudContext) cloudContext = new AudioContextCtor();
    await cloudContext.resume();
    const decoded = await cloudContext.decodeAudioData(sound.slice(0));
    if (current !== token) return;
    cloudSource = cloudContext.createBufferSource();
    cloudSource.buffer = decoded;
    cloudSource.connect(cloudContext.destination);
    cloudSource.onended = () => { if(current === token) onEnd?.(); };
    cloudSource.start();
  };

  return {
    supported,
    hasNativeUzbek: () => !!byPrefix('uz'),
    stop,
    speak(text: string, lang: 'uz'|'en', onEnd?: () => void) {
      stop();
      const current = token;
      const input = clean(text, lang).slice(0,1600);
      if (!input) { onEnd?.(); return false; }
      // Unlock WebAudio synchronously on the original speaker-button click (iOS).
      try {
        if (!cloudContext && window.AudioContext) cloudContext = new window.AudioContext();
        cloudContext?.resume();
      } catch { /* native speech can still work */ }
      // High-quality AI TTS is optional and requires GEMINI_API_KEY in Netlify env.
      // When absent or unreachable, use the device's selected natural voice.
      const hosted = window.location.protocol !== 'file:';
      if (!hosted) return speakNative(input,lang,current,onEnd);
      ttsController = new AbortController();
      fetch('/api/tts', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ text: input.slice(0,650), lang }),
        signal:ttsController.signal
      })
      .then(async response => {
        if (!response.ok) throw new Error('Cloud TTS unavailable');
        return response.json();
      })
      .then(async data => {
        if (current !== token) return;
        if (!data?.audioBase64) throw new Error('Audio data empty');
        await playCloud(data.audioBase64, data.mimeType || 'audio/L16;rate=24000', current, onEnd);
      })
      .catch(() => { if (current === token) speakNative(input,lang,current,onEnd); });
      return true;
    }
  };
})();
