export async function register({ email, password, fullName, phone }: { email: string, password: string, fullName: string, phone: string }) {
  const res = await fetch("http://localhost:4000/api/register-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email.split("@")[0],
      password,
      fullName,
      email,
      phone,
      role: "guest"
    })
  });
  return res.json();
}
