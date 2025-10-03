import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { getSafeDatabaseError, getSafeValidationError, logError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

const nullableDate = z.union([z.string().min(1), z.literal(""), z.null()]);

const experienceSchema = z.object({
  title: z.string().min(3),
  organization: z.string().min(2),
  start_date: z.string().min(1),
  end_date: nullableDate.optional(),
  description: z.string().min(10).optional(),
  type: z.enum(["education", "work", "research"]),
  current: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = experienceSchema.safeParse(json);

  if (!parsed.success) {
    logError("Experience validation failed", parsed.error, {
      userId: session.user.id,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .insert({
      title: payload.title,
      organization: payload.organization,
      start_date: payload.start_date,
      end_date: payload.end_date || null,
      description: payload.description ?? null,
      type: payload.type,
      current: payload.current ?? false,
    })
    .select()
    .maybeSingle();

  if (error) {
    logError("Failed to create experience", error, {
      userId: session.user.id,
      experienceTitle: payload.title,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'CREATE',
    'experience',
    data.id,
    request,
    {
      title: payload.title,
      organization: payload.organization,
      type: payload.type,
    }
  );

  return NextResponse.json(data, { status: 201 });
}
