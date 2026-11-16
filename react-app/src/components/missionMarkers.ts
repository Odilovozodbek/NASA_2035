/** Mission-specific, transparent spacecraft silhouettes used on the existing maps.
 * No emoji, generic status circles or external assets; the drawing is bundled offline.
 */
const svgCache = new Map<string, string>();

const definitions = `<defs>
 <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9fbff"/><stop offset=".43" stop-color="#9daebc"/><stop offset="1" stop-color="#536c7d"/></linearGradient>
 <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffedac"/><stop offset=".54" stop-color="#c99029"/><stop offset="1" stop-color="#83611f"/></linearGradient>
 <linearGradient id="cell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e75a8"/><stop offset="1" stop-color="#0a274a"/></linearGradient>
 <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="1.2" dy="3" stdDeviation="2.5" flood-color="#01040b" flood-opacity=".85"/></filter>
 </defs>`;
const line = `stroke="#243744" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;
const rod = `stroke="url(#metal)" stroke-width="3" stroke-linecap="round"`;
const wheel = (cx: number, cy: number, r = 11) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1d2933" stroke="#bcc6c5" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r * .48}" fill="#b6b6a7" stroke="#405764" stroke-width="2"/><path d="M${cx-r*.78} ${cy}h${r*1.56} M${cx} ${cy-r*.78}v${r*1.56}" stroke="#8b9ba1" stroke-width="1.5"/>`;
const solarPanel = (x: number, y: number, width: number, height: number, divisions = 4) => `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="1" fill="url(#cell)" stroke="#c5d4d9" stroke-width="2"/>${Array.from({length: divisions - 1},(_,i) => `<path d="M${x+(i+1)*width/divisions} ${y}v${height}" stroke="#73a6c0" stroke-opacity=".65" stroke-width="1"/>`).join('')}<path d="M${x} ${y+height/2}h${width}" stroke="#73a6c0" stroke-opacity=".5" stroke-width="1"/></g>`;
const dish = (cx: number, cy: number, sx = 1, sy = 1) => `<g transform="translate(${cx} ${cy}) scale(${sx} ${sy})"><path d="M-24 -3 Q0 24 24 -3 Q0 -19 -24 -3" fill="url(#metal)" stroke="#d7e8ed" stroke-width="2"/><path d="M-18 -3 Q0 13 18 -3 M0 -3v15" stroke="#6f8893" fill="none" stroke-width="1.2"/><path d="M0 -13v13 M-12 -3L0 -13 12 -3" fill="none" stroke="#e1e4da" stroke-width="1.5"/><circle cx="0" cy="-13" r="2.5" fill="#f4d693"/></g>`;

function equipmentType(id: string): string {
  if (/apollo15|apollo16|apollo17/.test(id)) return 'lrv';
  if (/apollo11|apollo14/.test(id)) return 'lunar-module';
  if (/surveyor/.test(id)) return 'surveyor';
  if (/ranger|lcross|mpl/.test(id)) return 'impactor';
  if (/prospector|grail/.test(id)) return 'orbiter';
  if (/opportunity|spirit/.test(id)) return 'mer';
  if (/ingenuity/.test(id)) return 'helicopter';
  if (/viking/.test(id)) return 'viking';
  if (/sojourner/.test(id)) return 'sojourner';
  if (/phoenix|insight/.test(id)) return 'lander';
  if (/curiosity|perseverance/.test(id)) return 'big-rover';
  if (/pioneer/.test(id)) return 'pioneer';
  if (/voyager/.test(id)) return 'voyager';
  if (/newhorizons/.test(id)) return 'newhorizons';
  if (/galileo/.test(id)) return 'galileo';
  if (/cassini/.test(id)) return 'cassini';
  return 'orbiter';
}

export function getMissionMarkerUrl(id: string): string {
  const cached = svgCache.get(id);
  if (cached) return cached;
  const kind = equipmentType(id);
  let art = '';
  switch (kind) {
    case 'lrv':
      art = `<path d="M12 45h73 M19 44l7 23h50l8-23" ${rod}/><path d="M25 43h50v23H25z" fill="none" ${line}/><path d="M32 42v-16l13-5 10 4v18 M57 42v-17l13-5 8 4v19" stroke="#dce6ec" stroke-width="4" fill="none"/><rect x="30" y="36" width="20" height="7" fill="#4b626c"/><rect x="56" y="35" width="20" height="8" fill="#64747b"/><rect x="42" y="44" width="13" height="13" rx="2" fill="url(#gold)"/><path d="M16 44l-7-12 M81 43l8-12" ${rod}/>${dish(75,20,.52,.55)}${wheel(23,69,12)}${wheel(77,69,12)}`;
      break;
    case 'lunar-module':
      art = `<path d="M26 38L14 73h-9 M69 38l13 35h10 M41 49l-3 25h-10 M57 49l3 25h10" fill="none" stroke="#c7d4d8" stroke-width="3"/><path d="M29 28l18-14 19 14-5 28H33z" fill="url(#gold)" stroke="#d5a958" stroke-width="2"/><path d="M35 21L48 9l15 12v25H35z" fill="url(#metal)" stroke="#bdc8d1" stroke-width="2"/><path d="M47 10v-8 M45 54l-10 21 M52 54l9 21" ${rod}/><path d="M39 25h19l-4 12H43z" fill="#142638"/><path d="M38 52l11 15 12-15" fill="none" stroke="#dba948" stroke-width="2"/><path d="M8 73h17 M73 73h17" stroke="#f8df9d" stroke-width="5"/>`;
      break;
    case 'surveyor':
      art = `<path d="M44 27L14 77h-9 M48 28l30 49h11 M47 30l-1 48" ${rod}/><path d="M28 38l22-15 23 17-12 17H39z" fill="url(#metal)" ${line}/><rect x="39" y="31" width="20" height="21" rx="2" fill="url(#gold)"/><path d="M46 23V10" ${rod}/>${dish(48,14,.58,.45)}<rect x="15" y="69" width="18" height="6" fill="url(#metal)"/><rect x="70" y="69" width="18" height="6" fill="url(#metal)"/><rect x="38" y="76" width="19" height="6" fill="url(#metal)"/><path d="M29 42L16 58" ${rod}/><rect x="8" y="53" width="13" height="12" rx="2" fill="url(#metal)"/>`;
      break;
    case 'mer':
      art = `<path d="M9 54h78L73 67H24z" fill="none" ${line}/><path d="M22 44L6 31l24-9 18 11 18-11 24 9-17 14z" fill="url(#cell)" stroke="#b4c9cf" stroke-width="2"/><path d="M22 35l52-1M48 28v16" stroke="#79aecd"/><rect x="34" y="44" width="29" height="18" rx="2" fill="url(#gold)"/><path d="M52 40V15" ${rod}/><rect x="44" y="12" width="19" height="10" rx="3" fill="url(#metal)"/><circle cx="49" cy="17" r="3" fill="#193c56"/><circle cx="58" cy="17" r="3" fill="#193c56"/><path d="M61 53l15-12" ${rod}/>${wheel(17,71,9)}${wheel(46,72,9)}${wheel(78,71,9)}`;
      break;
    case 'big-rover':
      art = `<rect x="17" y="36" width="62" height="27" rx="4" fill="url(#metal)" ${line}/><path d="M21 36L33 27h35l11 9" fill="url(#gold)" ${line}/><path d="M62 35V13" ${rod}/><rect x="57" y="10" width="18" height="12" rx="2" fill="#ced8d7"/><rect x="59" y="12" width="6" height="5" fill="#163d5d"/><rect x="68" y="12" width="5" height="5" fill="#163d5d"/><path d="M21 53L9 65 M80 52l10 12 M44 57v13" ${rod}/>${wheel(14,70,9)}${wheel(46,71,9)}${wheel(82,70,9)}<path d="M17 43h61" stroke="#253f54" stroke-width="4"/>`;
      break;
    case 'sojourner':
      art = `${solarPanel(23,25,50,22,5)}<path d="M25 47l-9 18M70 47l9 18 M46 47v17" ${rod}/><rect x="31" y="49" width="36" height="12" rx="2" fill="url(#gold)"/>${wheel(15,70,8)}${wheel(47,72,8)}${wheel(81,70,8)}<path d="M44 23V14" ${rod}/><circle cx="44" cy="12" r="3" fill="#f1d69c"/>`;
      break;
    case 'helicopter':
      art = `<path d="M48 18v41" stroke="#b0c9cb" stroke-width="4"/><path d="M5 21h86" stroke="#9db2b8" stroke-width="5"/><path d="M22 27h53" stroke="#d8e7ed" stroke-width="3"/>${solarPanel(33,29,30,10,5)}<rect x="38" y="48" width="20" height="18" fill="url(#gold)" ${line}/><path d="M38 57L18 82H9 M58 57L77 82h10 M38 64L23 82 M58 64l16 18" fill="none" ${rod}/><path d="M7 82h25 M67 82h22" stroke="#e5eced" stroke-width="3"/>`;
      break;
    case 'viking':
      art = `<path d="M47 34L19 71H9 M50 34l27 37h11 M46 35v38" ${rod}/><rect x="29" y="32" width="38" height="27" rx="3" fill="url(#gold)" ${line}/><path d="M26 29L46 12 69 29" fill="url(#metal)" stroke="#d9e3e8" stroke-width="4"/>${dish(49,15,.52,.5)}<path d="M8 73h19 M69 73h20" stroke="#adbfc9" stroke-width="5"/>`;
      break;
    case 'lander':
      art = `<path d="M30 43L14 72H7 M68 43l15 29h8 M48 43v34" ${rod}/><rect x="34" y="32" width="28" height="28" rx="3" fill="url(#gold)" ${line}/>${solarPanel(4,35,28,15,3)}${solarPanel(65,35,27,15,3)}<path d="M48 31V15" ${rod}/>${dish(48,17,.48,.46)}<path d="M7 73h17 M75 73h18" stroke="#cad8dc" stroke-width="4"/>`;
      break;
    case 'impactor':
      art = `<path d="M48 7Q58 21 62 39l-2 23-12 12-13-12-2-23Q39 20 48 7z" fill="url(#metal)" ${line}/><rect x="35" y="34" width="26" height="20" fill="url(#gold)"/><path d="M33 41L18 51l16 7 M62 41l16 10-16 7" fill="url(#metal)" ${line}/><path d="M35 62l-9 19 20-9 20 9-7-19" fill="#687f89"/><circle cx="48" cy="26" r="7" fill="#153a53" stroke="#a8ccd5" stroke-width="2"/>`;
      break;
    case 'orbiter':
      art = `${solarPanel(4,33,30,26,4)}${solarPanel(64,33,29,26,4)}<path d="M33 46h31" ${rod}/><rect x="37" y="33" width="23" height="29" rx="3" fill="url(#gold)" ${line}/><path d="M48 33V16" ${rod}/>${dish(48,17,.42,.42)}<path d="M49 63v14" ${rod}/>`;
      break;
    case 'pioneer':
      art = `${dish(48,23,1.38,1.15)}<path d="M48 42v20 M34 43L11 64 M60 43L85 66" ${rod}/><path d="M38 53l10-6 12 6v17H38z" fill="url(#gold)" ${line}/><rect x="4" y="64" width="17" height="8" rx="2" fill="#637580" stroke="#d5dfe0"/><rect x="77" y="64" width="17" height="8" rx="2" fill="#637580" stroke="#d5dfe0"/><path d="M48 70v17" ${rod}/>`;
      break;
    case 'voyager':
      art = `${dish(51,22,1.25,1.1)}<path d="M47 44L27 61 M50 44L74 64 M50 44v26" ${rod}/><path d="M42 51h21v19H42z" fill="url(#gold)" ${line}/><circle cx="50" cy="60" r="6" fill="#dcaa49" stroke="#eed69f" stroke-width="2"/><path d="M31 59L6 66" ${rod}/><rect x="3" y="62" width="23" height="10" rx="3" fill="url(#metal)"/><path d="M67 63l22 12" ${rod}/><rect x="81" y="69" width="13" height="10" fill="#506671"/>`;
      break;
    case 'newhorizons':
      art = `<path d="M24 34l24-15 25 15v31L49 78 25 65z" fill="url(#gold)" ${line}/>${dish(53,29,.72,.72)}<rect x="10" y="47" width="17" height="20" fill="url(#metal)"/><path d="M77 52l13 12" ${rod}/><circle cx="90" cy="67" r="5" fill="#93a3b0"/>`;
      break;
    case 'galileo':
      art = `${dish(49,22,1.2,1.1)}<path d="M49 44v26 M34 55l-24 15 M63 54l24 17" ${rod}/><rect x="40" y="49" width="19" height="19" fill="url(#gold)" ${line}/><path d="M16 67l-9 10 M80 68l10 10" stroke="#d6c69d" stroke-width="5"/>`;
      break;
    case 'cassini':
      art = `${dish(49,27,1.23,1.15)}<path d="M49 47v28" ${rod}/><rect x="36" y="49" width="25" height="28" rx="2" fill="url(#gold)" ${line}/><path d="M37 58L13 77 M60 58l26 19" ${rod}/><rect x="7" y="73" width="13" height="9" fill="#829198"/><rect x="78" y="73" width="13" height="9" fill="#829198"/>`;
      break;
  }
  // Transparent silhouette; focus/selection is applied by the map, not painted into the icon.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">${definitions}<g filter="url(#shadow)">${art}</g></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  svgCache.set(id, url);
  return url;
}
