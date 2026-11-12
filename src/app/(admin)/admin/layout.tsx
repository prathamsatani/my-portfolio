import type { ReactNode } from "react";

// Admin pages need Supabase at request time; never prerender them at build.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // No authentication check here - it's handled in the (protected) folder layout
  // and the middleware. This layout is just for the /admin route structure.
  return <>{children}</>;
}
