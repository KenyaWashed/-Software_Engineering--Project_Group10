import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RevenueContent from "@/components/dashboard/RevenueContent";
import { checkSession } from "@/lib/auth/checkSession";

export default async function Revenue() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await checkSession(cookieString);
  if (!res?.user || res.user.role !== "admin") {
    redirect("/");
  }
  return <RevenueContent />;
}
