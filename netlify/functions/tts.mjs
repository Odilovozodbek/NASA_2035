// Text to speech via Gemini. Needs GEMINI_API_KEY in Netlify env.
const response = (statusCode, data) => ({ statusCode,
  headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }, body:JSON.stringify(data) });
export async function handler(event) {
  if (event.httpMethod !== 'POST') return response(405, { error:'Only POST is supported' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return response(503, { error:'TTS requires GEMINI_API_KEY' });
  let input;
  try { input = JSON.parse(event.body || '{}'); } catch { return response(400, {error:'Invalid JSON'}); }
  const text = String(input.text || '').trim().slice(0, 650);
  if (!text) return response(400, { error:'Text is required' });
  const lang = input.lang === 'en' ? 'English' : 'Uzbek';
  const voiceName = 'Kore';
  const models = [process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts'];
  if (models[0] !== 'gemini-2.5-flash-preview-tts') models.push('gemini-2.5-flash-preview-tts');
  for (const model of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method:'POST',
        headers: {'x-goog-api-key':key, 'Content-Type':'application/json'},
        signal:AbortSignal.timeout(29000),
        body: JSON.stringify({
          contents:[{parts:[{text:`Read aloud in fluent, natural ${lang} with a calm scientific documentary tone. Pronounce space mission names clearly. Say only the transcript:\n${text}`}]}],
          generationConfig:{responseModalities:['AUDIO'], speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName}}}}
        })
      });
      if (!r.ok) continue;
      const result = await r.json();
      const part = result?.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.data);
      if (part) return response(200, { audioBase64:part.inlineData.data, mimeType:part.inlineData.mimeType || 'audio/L16;rate=24000' });
    } catch { /* fallback to next voice model */ }
  }
  return response(503, {error:'Cloud voice unavailable; browser speech fallback will be used'});
}
