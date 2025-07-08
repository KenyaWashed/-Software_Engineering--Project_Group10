import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomsContent from "@/components/dashboard/RoomsContent";
import { checkSession } from "@/lib/auth/checkSession";

export default async function AdminRoomsPage() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await checkSession(cookieString);
  if (!res?.user || res.user.role !== "admin") {
    redirect("/");
  }
  return <RoomsContent />;
}
