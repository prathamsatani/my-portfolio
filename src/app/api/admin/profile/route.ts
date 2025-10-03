import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const profileSchema = z.object({
  full_name: z.string().max(120).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(2000).optional(),
  title: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  profile_image_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  resume_url: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = profileSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();

  const { data: existing, error: selectError } = await supabase
    .from("portfolio_profile")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (selectError) {
    console.error("Failed to check existing profile:", selectError.message);
    return NextResponse.json({ error: selectError.message }, { status: 500 });
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
    console.error("Failed to save profile:", mutationError.message);
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
