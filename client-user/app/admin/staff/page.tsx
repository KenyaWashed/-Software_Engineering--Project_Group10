import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StaffContent from "@/components/dashboard/StaffContent";
import { checkSession } from "@/lib/auth/checkSession";

export default async function Staff() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await checkSession(cookieString);
  if (!res?.user || res.user.role !== "admin") {
    redirect("/");
  }
  return <StaffContent />;
}
