// Server-side Gemini gateway for the ECHO-RELIC AI panel (Netlify Functions).
// Set GEMINI_API_KEY in Netlify environment variables. Never commit the key.
const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});
export async function handler(event) {
  const key = process.env.GEMINI_API_KEY;
  if (event.httpMethod === 'GET') return json(200, { connected: !!key, provider: 'Gemini via Netlify' });
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!key) return json(503, { error: 'GEMINI_API_KEY is not configured on this site.' });
  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid JSON body' }); }
  if (!Array.isArray(payload.contents) || payload.contents.length > 12) return json(400, { error: 'Invalid chat history' });
  if (!payload.contents.some(c => c.role === 'user')) return json(400, { error: 'A user question is required' });
  const contents = payload.contents.map(message => ({
    role: message.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(message.parts?.[0]?.text || '').slice(0, 2500) }]
  }));
  const systemText = String(payload.systemInstruction?.parts?.[0]?.text || '').slice(0, 10000);
  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemText }] },
    generationConfig: { temperature: .45, maxOutputTokens: 420 }
  };
  try {
    const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
    const timeout = AbortSignal.timeout(24000);
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body), signal: timeout
    });
    if (!r.ok) return json(502, { error: `Gemini returned HTTP ${r.status}` });
    const data = await r.json();
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) return json(502, { error:'Empty Gemini response' });
    return json(200, data);
  } catch (err) {
    return json(502, { error: err?.name === 'TimeoutError' ? 'Gemini timed out' : 'Gemini is unreachable' });
  }
}
