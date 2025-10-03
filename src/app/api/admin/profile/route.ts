import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { getSafeDatabaseError, getSafeValidationError, logError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

const profileSchema = z.object({
  full_name: z.string().max(120).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(2000).optional(),
  title: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  profile_image_url: z.string().url().optional().or(z.literal("")).nullable(),
  github_url: z.string().url().optional().or(z.literal("")).nullable(),
  linkedin_url: z.string().url().optional().or(z.literal("")).nullable(),
  resume_url: z.string().url().optional().or(z.literal("")).nullable(),
});

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = profileSchema.safeParse(json);

  if (!parsed.success) {
    logError("Profile validation failed", parsed.error, {
      userId: session.user.id,
    });
    const errorMessage = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    return NextResponse.json({ error: getSafeValidationError(new Error(errorMessage)) }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();

  const { data: existing, error: selectError } = await supabase
    .from("portfolio_profile")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (selectError) {
    logError("Failed to check existing profile", selectError, {
      userId: session.user.id,
    });
    return NextResponse.json({ error: getSafeDatabaseError(selectError) }, { status: 500 });
  }

  const mutationPayload = {
    ...payload,
    profile_image_url: payload.profile_image_url || null,
    github_url: payload.github_url || null,
    linkedin_url: payload.linkedin_url || null,
    resume_url: payload.resume_url || null,
  };

  let mutationError: { message: string } | null = null;

  if (existing?.id) {
    const { error } = await supabase
      .from("portfolio_profile")
      .update(mutationPayload)
      .eq("id", existing.id);

    mutationError = error;
  } else {
    const { error } = await supabase
      .from("portfolio_profile")
      .insert(mutationPayload);

    mutationError = error;
  }

  if (mutationError) {
    logError("Failed to save profile", mutationError, {
      userId: session.user.id,
      isUpdate: !!existing?.id,
    });
    return NextResponse.json({ error: getSafeDatabaseError(mutationError) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    existing?.id ? 'UPDATE' : 'CREATE',
    'profile',
    existing?.id || null,
    request,
    {
      fields: Object.keys(payload),
    }
  );

  return NextResponse.json({ success: true });
}
