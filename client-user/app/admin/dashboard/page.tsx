import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";
import { checkSession } from "@/lib/auth/checkSession";

export default async function AdminDashboardPage() {
  // Lấy cookie từ request (async)
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // Gọi API checkSession và truyền cookie
  const res = await checkSession(cookieString);

  if (!res?.user || res.user.role !== "admin") {
    redirect("/");
  }
  return <Dashboard />;
}