/* Vercel Routing Middleware: every page and file of the portal needs a signed-in Neon Auth session.
   Public: the sign-in / set-password pages, the auth proxy, and the brand mark they show. */
import { next } from '@vercel/functions';
import { processAuthMiddleware } from '@neondatabase/auth/server';

const PUBLIC = ['/api/auth', '/login', '/set-password', '/auth-assets', '/favicon.ico'];

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (PUBLIC.some(p => path === p || path.startsWith(p + '/'))) return next();

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret) return new Response('Sign-in is not configured yet.', { status: 503 });

  let out;
  try {
    out = await processAuthMiddleware({
      request, pathname: path, skipRoutes: PUBLIC, loginUrl: '/login/',
      baseUrl, cookieSecret, sessionDataTtl: 120, sameSite: 'lax',
    });
  } catch (e) {
    out = { action: 'redirect_login' };
  }

  if (out.action === 'allow') {
    const h = new Headers();
    (out.cookies || []).forEach(c => h.append('set-cookie', c));
    return next({ headers: h });
  }
  if (out.action === 'redirect_oauth') {
    const h = new Headers({ location: String(out.redirectUrl) });
    (out.cookies || []).forEach(c => h.append('set-cookie', c));
    return new Response(null, { status: 302, headers: h });
  }
  // Not signed in: pages go to the sign-in screen and come back after; data/asset requests just get 401.
  const wantsPage = (request.headers.get('accept') || '').includes('text/html');
  if (!wantsPage) return new Response('Sign in required', { status: 401 });
  const login = new URL('/login/', url);
  if (path !== '/' && path !== '/mccorvey/') login.searchParams.set('next', path + url.search);
  const h = new Headers({ location: login.toString() });
  (out.cookies || []).forEach(c => h.append('set-cookie', c));
  return new Response(null, { status: 302, headers: h });
}

export const config = { runtime: 'nodejs' };
