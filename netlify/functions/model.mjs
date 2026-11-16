// Whitelisted NASA GLB model relay: prevents NASA cross-origin restrictions on deployed Netlify sites.
// No arbitrary URL is accepted from users.
const urls = Object.freeze({
  'pioneer-10':'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/pioneer-10/Pioneer%2010.glb',
  'voyager-1':'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/voyager-probe-%28b%29/Voyager%20Probe%20%28B%29.glb',
  'opportunity-rover':'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-exploration-rover---opportunity-%28mer-b%29/Mars%20Exploration%20Rover%20-%20Opportunity%20%28MER-B%29.glb',
  'ingenuity-heli':'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/ingenuity-mars-helicopter/Ingenuity%20Mars%20Helicopter.glb'
});
const fail = (statusCode, message) => ({statusCode, headers:{'Content-Type':'text/plain'},body:message});
export async function handler(event) {
  if (event.httpMethod !== 'GET') return fail(405,'GET only');
  const id = event.queryStringParameters?.id || '';
  const url = Object.hasOwn(urls,id) ? urls[id] : null;
  if (!url) return fail(404,'Model is not available');
  try {
    const response = await fetch(url,{signal:AbortSignal.timeout(20000)});
    if (!response.ok) return fail(502,`NASA model unavailable: ${response.status}`);
    const body = Buffer.from(await response.arrayBuffer());
    if (body.length > 4_000_000) return fail(502,'Model exceeds size limit');
    return {statusCode:200, isBase64Encoded:true,
      headers:{'Content-Type':'model/gltf-binary','Cache-Control':'public, max-age=86400, s-maxage=86400'},
      body:body.toString('base64')};
  } catch {
    return fail(502,'NASA model server is unreachable');
  }
}
