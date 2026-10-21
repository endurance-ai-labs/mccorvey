/* Same-site proxy to Neon Auth (Managed Better Auth): /api/auth/<route> -> NEON_AUTH_BASE_URL/<route>.
   Keeps the session cookie first-party on this domain so the middleware can see it. */
import { handleAuthProxyRequest } from '@neondatabase/auth/server';

async function handle(request) {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret) return Response.json({ message: 'Sign-in is not configured yet.' }, { status: 503 });
  const path = new URL(request.url).pathname.replace(/^\/api\/auth\/?/, '');
  // Public sign-up stays closed: accounts are only created by an admin invite.
  if (/^sign-up(\/|$)/.test(path)) return Response.json({ message: 'Accounts are created by invitation only.' }, { status: 403 });
  return handleAuthProxyRequest({ request, path, baseUrl, cookieSecret, sessionDataTtl: 120, sameSite: 'lax' });
}

export const GET = handle;
export const POST = handle;
