/* Small helpers shared by the sign-in, set-password and admin pages. All calls go through
   the same-site proxy at /api/auth, so the session cookie stays on this domain. */
async function authCall(path, body, method) {
  const res = await fetch('/api/auth/' + path, {
    method: method || (body ? 'POST' : 'GET'),
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    const m = (data && (data.message || data.error && data.error.message || data.code)) || ('Request failed (' + res.status + ')');
    throw new Error(m);
  }
  return data;
}
function setMsg(el, text, kind) { el.textContent = text || ''; el.className = 'msg' + (kind ? ' ' + kind : ''); }
function safeNext(raw) {
  // Only same-site paths, never another host.
  if (!raw || raw[0] !== '/' || raw.startsWith('//')) return '/mccorvey/';
  return raw;
}
function randomSecret() {
  const a = new Uint8Array(32); crypto.getRandomValues(a);
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('') + 'Aa1!';
}
