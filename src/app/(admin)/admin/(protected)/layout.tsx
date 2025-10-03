import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseServerComponentClient } from "@/lib/supabaseServer";

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  return <AdminShell adminEmail={session.user.email}>{children}</AdminShell>;
}
