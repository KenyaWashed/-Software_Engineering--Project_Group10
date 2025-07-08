import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PoliciesContent from "@/components/dashboard/PoliciesContent";
import { checkSession } from "@/lib/auth/checkSession";

export default async function Policies() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await checkSession(cookieString);
  if (!res?.user || res.user.role !== "admin") {
    redirect("/");
  }
  return <PoliciesContent />;
}
