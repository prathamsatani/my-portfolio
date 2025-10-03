import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow non-admin paths to pass through immediately
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // ALWAYS allow the login page - no checks needed
  if (pathname === "/admin/login") {
    if (process.env.NODE_ENV === 'development') {
      console.log("[Middleware] Allowing access to login page");
    }
    return NextResponse.next();
  }

  // Create response object
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Get Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Middleware] Supabase configuration missing");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log("[Middleware] Checking auth for:", pathname);
  }

  // Create Supabase client for middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Check for admin session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthorised = session?.user?.app_metadata?.role === "admin";

  if (process.env.NODE_ENV === 'development') {
    console.log("[Middleware] Session exists:", !!session);
    console.log("[Middleware] User role:", session?.user?.app_metadata?.role);
    console.log("[Middleware] Is authorized:", isAuthorised);
  }

  if (isAuthorised) {
    if (process.env.NODE_ENV === 'development') {
      console.log("[Middleware] Access granted to:", pathname);
    }
    return response;
  }

  // Redirect to login if not authorized
  if (process.env.NODE_ENV === 'development') {
    console.log("[Middleware] Redirecting to login from:", pathname);
  }
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/admin/login";
  redirectUrl.searchParams.set("redirectTo", pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
