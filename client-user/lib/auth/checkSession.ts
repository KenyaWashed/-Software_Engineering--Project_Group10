// lib/auth/checkSession.ts
export async function checkSession(cookie?: string) {
  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;

  const res = await fetch('http://localhost:4000/api/check-session', {
    method: 'GET',
    credentials: 'include',
    headers,
    cache: "no-store",
  });
  return res.json();
}