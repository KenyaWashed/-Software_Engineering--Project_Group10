export async function checkSession() {
  const res = await fetch('http://localhost:4000/api/check-session', {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
}