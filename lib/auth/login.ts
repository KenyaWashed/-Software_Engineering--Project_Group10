export async function login({ email, password, rememberMe }: { email: string, password: string, rememberMe: boolean }) {
  const res = await fetch('http://localhost:4000/api/login-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, rememberMe })
  });
  return res.json();
}