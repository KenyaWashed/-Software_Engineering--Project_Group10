export async function logout() {
  const res = await fetch('http://localhost:4000/api/logout', {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
}