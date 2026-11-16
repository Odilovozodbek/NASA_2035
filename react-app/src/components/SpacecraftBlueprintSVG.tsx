import React from 'react';

interface SpacecraftBlueprintSVGProps {
  relicId: string;
  xrayMode: boolean;
  dustLevel: number;
  activeHotspotId: string;
  pingWave: boolean;
}

export const SpacecraftBlueprintSVG: React.FC<SpacecraftBlueprintSVGProps> = ({
  relicId,
  xrayMode,
  dustLevel,
  pingWave
}) => {
  const strokeMain = xrayMode ? '#22d3ee' : '#38bdf8';
  const strokeInternal = xrayMode ? '#f43f5e' : 'rgba(56, 189, 248, 0.25)';
  const fillBody = xrayMode ? 'rgba(8, 47, 73, 0.35)' : 'rgba(15, 23, 42, 0.85)';

  return (
    <svg
      viewBox="0 0 800 460"
      className="w-full h-full select-none transition-all duration-500"
      style={{ filter: xrayMode ? 'drop-shadow(0 0 12px rgba(34,211,238,0.35))' : 'none' }}
    >
      <defs>
        <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
          <circle cx="20" cy="20" r="0.8" fill="rgba(56, 189, 248, 0.25)" />
        </pattern>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity={xrayMode ? 0.35 : 0.75} />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity={xrayMode ? 0.35 : 0.85} />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect width="800" height="460" fill="url(#blueprintGrid)" />

      <g stroke="rgba(34, 211, 238, 0.45)" strokeWidth="2" fill="none">
        <path d="M 18 45 L 18 18 L 45 18" />
        <path d="M 755 18 L 782 18 L 782 45" />
        <path d="M 18 415 L 18 442 L 45 442" />
        <path d="M 755 442 L 782 442 L 782 415" />
      </g>

      {pingWave && (
        <g>
          <circle cx="400" cy="230" r="60" fill="none" stroke="#22d3ee" strokeWidth="3" opacity="0.8">
            <animate attributeName="r" from="20" to="380" dur="1.4s" repeatCount="1" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="1" />
          </circle>
          <circle cx="400" cy="230" r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6">
            <animate attributeName="r" from="10" to="320" dur="1.4s" begin="0.2s" repeatCount="1" />
            <animate attributeName="opacity" from="0.8" to="0" dur="1.4s" begin="0.2s" repeatCount="1" />
          </circle>
        </g>
      )}

      {/* 1. APOLLO 15 LUNAR ROVING VEHICLE (LRV) */}
      {relicId === 'apollo-lrv' && (
        <g transform="translate(0, 10)">
          <path d="M 40 365 Q 240 345 420 362 T 760 355" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="210" y="245" width="360" height="28" rx="6" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          <rect x="335" y="195" width="95" height="50" rx="4" fill={xrayMode ? 'rgba(244,63,94,0.25)' : 'rgba(30,41,59,0.9)'} stroke={xrayMode ? '#fb7185' : strokeMain} strokeWidth="2" />
          <text x="382" y="224" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="monospace">2x 36V Ag-Zn</text>
          {xrayMode && (
            <path d="M 382 245 L 382 260 L 195 260 M 382 260 L 585 260" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
          )}
          <path d="M 305 245 L 290 175 L 265 175 M 455 245 L 440 175 L 415 175" fill="none" stroke={strokeMain} strokeWidth="4" strokeLinecap="round" />
          <line x1="272" y1="245" x2="272" y2="115" stroke={strokeMain} strokeWidth="3" />
          <path d="M 212 125 Q 272 60 332 125 Z" fill="rgba(56, 189, 248, 0.18)" stroke={strokeMain} strokeWidth="2" />
          <line x1="272" y1="92" x2="272" y2="62" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="544" y1="245" x2="544" y2="165" stroke={strokeMain} strokeWidth="3" />
          <rect x="522" y="142" width="48" height="28" rx="4" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="574" cy="156" r="7" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.5" />
          {[195, 585].map((cx, idx) => (
            <g key={idx}>
              <circle cx={cx} cy="320" r="56" fill="rgba(15, 23, 42, 0.65)" stroke={strokeMain} strokeWidth="3" strokeDasharray="8 3" />
              <circle cx={cx} cy="320" r="42" fill="none" stroke={strokeInternal} strokeWidth="1.5" />
              <circle cx={cx} cy="320" r="16" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <line
                  key={angle}
                  x1={cx - 54 * Math.cos((angle * Math.PI) / 180)}
                  y1={320 - 54 * Math.sin((angle * Math.PI) / 180)}
                  x2={cx + 54 * Math.cos((angle * Math.PI) / 180)}
                  y2={320 + 54 * Math.sin((angle * Math.PI) / 180)}
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {/* 2. SURVEYOR 3 & APOLLO LASER RETROREFLECTOR (LRRR) */}
      {relicId === 'surveyor-lrrr' && (
        <g transform="translate(0, 10)">
          <path d="M 40 375 Q 380 350 760 375" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="90" y1="20" x2="416" y2="165" stroke="#10b981" strokeWidth="3" strokeDasharray="10 6">
            <animate attributeName="stroke-dashoffset" from="32" to="0" dur="0.8s" repeatCount="indefinite" />
          </line>
          <line x1="416" y1="165" x2="120" y2="20" stroke="#34d399" strokeWidth="2" opacity="0.75" />
          <text x="155" y="52" fill="#34d399" fontSize="11" fontFamily="monospace">532nm EARTH LASER PULSE (ACTIVE)</text>

          <polygon points="360,130 265,330 465,330" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          <line x1="265" y1="330" x2="185" y2="365" stroke={strokeMain} strokeWidth="4" />
          <line x1="465" y1="330" x2="555" y2="365" stroke={strokeMain} strokeWidth="4" />
          <rect x="155" y="362" width="55" height="10" rx="3" fill="#38bdf8" />
          <rect x="530" y="362" width="55" height="10" rx="3" fill="#38bdf8" />

          <g transform="translate(366, 138)">
            <rect x="0" y="0" width="105" height="62" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            {[0, 1, 2, 3, 4].map(col =>
              [0, 1, 2].map(row => (
                <circle key={`${col}-${row}`} cx={15 + col * 19} cy={14 + row * 17} r="6.5" fill="rgba(16, 185, 129, 0.35)" stroke="#34d399" strokeWidth="1.2" />
              ))
            )}
          </g>

          <path d="M 295 275 L 220 295 L 195 320 L 235 305" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <rect x="200" y="290" width="32" height="22" fill="url(#goldGrad)" />

          <rect x="520" y="225" width="52" height="58" rx="4" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
          <text x="546" y="258" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace">APOLLO 12 CUT</text>
        </g>
      )}

      {/* 3. OPPORTUNITY ROVER (MER-B) */}
      {relicId === 'opportunity-rover' && (
        <g transform="translate(0, 10)">
          <path d="M 40 375 Q 290 355 510 368 T 760 360" fill="none" stroke="rgba(251, 146, 60, 0.45)" strokeWidth="2" strokeDasharray="6 4" />
          <polygon points="150,195 635,195 575,248 210,248" fill="url(#solarGrad)" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="270" y1="195" x2="295" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />
          <line x1="395" y1="195" x2="395" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />
          <line x1="515" y1="195" x2="490" y2="248" stroke="rgba(186, 230, 253, 0.35)" strokeWidth="1.5" />

          <rect x="285" y="248" width="215" height="62" rx="6" fill={fillBody} stroke="#fbbf24" strokeWidth="2.5" />
          {xrayMode && (
            <g>
              <rect x="305" y="258" width="85" height="40" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="347" y="282" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily="monospace">WEB + RHU</text>
              <rect x="405" y="258" width="75" height="40" fill="rgba(34, 211, 238, 0.2)" stroke="#22d3ee" strokeWidth="1.5" />
              <text x="442" y="282" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">RAD6000 CPU</text>
            </g>
          )}

          <line x1="464" y1="205" x2="464" y2="88" stroke={strokeMain} strokeWidth="5" />
          <rect x="432" y="64" width="66" height="28" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="448" cy="78" r="6" fill="#22d3ee" />
          <circle cx="482" cy="78" r="6" fill="#22d3ee" />

          <path d="M 500 285 L 575 245 L 625 278" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="628" cy="282" r="18" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.5" />
          <text x="628" y="286" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace">APXS</text>

          <path d="M 215 348 L 265 295 L 365 348 M 365 348 L 430 290 L 545 348" fill="none" stroke={strokeMain} strokeWidth="3.5" />
          {[215, 365, 545].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="348" r="32" fill="#0f172a" stroke={strokeMain} strokeWidth="3" />
              <circle cx={cx} cy="348" r="20" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx={cx} cy="348" r="7" fill="#38bdf8" />
            </g>
          ))}
        </g>
      )}

      {/* 4. INGENUITY MARS HELICOPTER (GINNY) */}
      {relicId === 'ingenuity-heli' && (
        <g transform="translate(0, 10)">
          <path d="M 60 380 Q 400 345 740 380" fill="none" stroke="rgba(251, 146, 60, 0.45)" strokeWidth="2" strokeDasharray="6 4" />
          <rect x="330" y="45" width="140" height="18" rx="3" fill="url(#solarGrad)" stroke="#10b981" strokeWidth="2" />
          <line x1="400" y1="63" x2="400" y2="185" stroke={strokeMain} strokeWidth="6" />
          <path d="M 145 102 Q 270 86 400 102 Q 530 86 645 102 Q 530 116 400 102 Q 270 116 145 102 Z" fill="rgba(56, 189, 248, 0.25)" stroke={strokeMain} strokeWidth="2" />
          <path d="M 160 132 Q 280 118 400 132 Q 510 118 595 132 L 585 142 Q 500 138 400 132 Q 280 146 160 132 Z" fill="rgba(244, 63, 94, 0.22)" stroke="#fb7185" strokeWidth="2" strokeDasharray="8 2" />
          <circle cx="600" cy="135" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
          <text x="665" y="139" fill="#fda4af" fontSize="10" fontFamily="monospace">FLIGHT 72 TIP DAMAGE</text>

          <rect x="335" y="185" width="130" height="115" rx="8" fill={fillBody} stroke="#fbbf24" strokeWidth="2.5" />
          {xrayMode && (
            <g>
              <rect x="352" y="200" width="96" height="45" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
              <text x="400" y="226" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">6x SONY Li-ION</text>
              <rect x="352" y="252" width="96" height="32" rx="4" fill="rgba(34, 211, 238, 0.25)" stroke="#22d3ee" strokeWidth="1.5" />
              <text x="400" y="272" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">SNAPDRAGON 801</text>
            </g>
          )}
          <circle cx="400" cy="312" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="400" cy="312" r="5" fill="#34d399" />

          <line x1="340" y1="275" x2="215" y2="372" stroke={strokeMain} strokeWidth="3.5" />
          <line x1="355" y1="295" x2="275" y2="375" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="460" y1="275" x2="585" y2="372" stroke={strokeMain} strokeWidth="3.5" />
          <line x1="445" y1="295" x2="525" y2="375" stroke={strokeMain} strokeWidth="2.5" />
        </g>
      )}

      {/* 5. PIONEER 10 DEEP SPACE PROBE */}
      {relicId === 'pioneer-10' && (
        <g transform="translate(0, 5)">
          <ellipse cx="400" cy="160" rx="165" ry="62" fill="rgba(30, 41, 59, 0.85)" stroke={strokeMain} strokeWidth="3" />
          <ellipse cx="400" cy="160" rx="115" ry="40" fill="none" stroke={strokeInternal} strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1="290" y1="145" x2="400" y2="62" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="510" y1="145" x2="400" y2="62" stroke={strokeMain} strokeWidth="2.5" />
          <rect x="382" y="48" width="36" height="20" rx="3" fill="#0ea5e9" />

          <polygon points="335,222 465,222 485,295 315,295" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />

          <line x1="325" y1="245" x2="125" y2="215" stroke={strokeMain} strokeWidth="3.5" />
          <rect x="92" y="192" width="44" height="46" rx="4" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="2" />
          <text x="114" y="219" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="monospace">RTG</text>

          <line x1="475" y1="245" x2="700" y2="215" stroke={strokeMain} strokeWidth="3" strokeDasharray="8 3" />
          <circle cx="705" cy="215" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />

          <rect x="385" y="242" width="58" height="40" rx="3" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" />
          <circle cx="400" cy="256" r="5" fill="none" stroke="#451a03" strokeWidth="1.2" />
          <line x1="418" y1="250" x2="418" y2="274" stroke="#451a03" strokeWidth="1.5" />
          <line x1="430" y1="252" x2="430" y2="274" stroke="#451a03" strokeWidth="1.5" />
        </g>
      )}

      {/* 6. VOYAGER 1 INTERSTELLAR PROBE */}
      {relicId === 'voyager-1' && (
        <g transform="translate(0, 5)">
          <ellipse cx="400" cy="148" rx="175" ry="66" fill="rgba(15, 23, 42, 0.9)" stroke={strokeMain} strokeWidth="3" />
          <ellipse cx="400" cy="148" rx="125" ry="44" fill="none" stroke={strokeInternal} strokeWidth="1.5" />
          <line x1="280" y1="130" x2="400" y2="48" stroke={strokeMain} strokeWidth="2.5" />
          <line x1="520" y1="130" x2="400" y2="48" stroke={strokeMain} strokeWidth="2.5" />
          <circle cx="400" cy="48" r="12" fill="#10b981" />

          <rect x="330" y="214" width="140" height="86" rx="8" fill={fillBody} stroke={strokeMain} strokeWidth="2.5" />
          {xrayMode && (
            <text x="400" y="245" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace">69 KB FDS MEMORY</text>
          )}

          <circle cx="416" cy="276" r="24" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="2" />
          <circle cx="416" cy="276" r="6" fill="#78350f" />

          <line x1="330" y1="255" x2="145" y2="235" stroke={strokeMain} strokeWidth="4" />
          <rect x="105" y="214" width="58" height="38" rx="5" fill="rgba(245, 158, 11, 0.25)" stroke="#fbbf24" strokeWidth="2" />
          <text x="134" y="237" textAnchor="middle" fill="#fde047" fontSize="9" fontFamily="monospace">3x RTG</text>

          <line x1="470" y1="240" x2="695" y2="145" stroke="#10b981" strokeWidth="2.5" />
          <line x1="470" y1="265" x2="705" y2="295" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="672" cy="165" r="12" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="2" />
        </g>
      )}

      {dustLevel > 10 && (
        <g opacity={Math.min(0.85, dustLevel / 115)}>
          <rect
            x="0"
            y="0"
            width="800"
            height="460"
            fill={relicId.includes('opportunity') || relicId.includes('ingenuity') ? 'rgba(194, 65, 12, 0.18)' : 'rgba(148, 163, 184, 0.12)'}
          />
          {[80, 160, 240, 320, 410, 490, 580, 670, 720].map((px, idx) => (
            <circle
              key={idx}
              cx={px}
              cy={(idx * 67) % 390 + 30}
              r={(idx % 3) + 1.5}
              fill={relicId.includes('opportunity') || relicId.includes('ingenuity') ? '#fdba74' : '#cbd5e1'}
            />
          ))}
        </g>
      )}

      {xrayMode && (
        <line x1="20" y1="0" x2="780" y2="0" stroke="#22d3ee" strokeWidth="2" opacity="0.7">
          <animate attributeName="y1" values="20;440;20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;440;20" dur="4s" repeatCount="indefinite" />
        </line>
      )}
    </svg>
  );
};
