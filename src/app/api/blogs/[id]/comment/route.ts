import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { logError, getSafeDatabaseError, getSafeValidationError } from "@/lib/errors";

const hasSupabaseConfig = Boolean(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const commentSchema = z.object({
  author: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  message: z.string().min(5, "Comment must be at least 5 characters").max(500, "Comment is too long"),
});

interface CommentResponse {
  id: string;
  author: string;
  message: string;
  date: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await context.params;
  
  if (!blogId) {
    return NextResponse.json({ error: "Blog id is required" }, { status: 400 });
  }

  if (!hasSupabaseConfig) {
    return NextResponse.json(
      { error: "Comments are not available. Supabase is not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      logError("Failed to validate comment", parsed.error, { blogId, body });
      return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
    }

    const { author, message } = parsed.data;

    const supabase = getSupabaseServiceRoleClient();

    // Verify blog exists
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("id")
      .eq("id", blogId)
      .eq("status", "published")
      .single();

    if (blogError || !blog) {
      logError("Blog not found or not published", blogError, { blogId });
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Insert comment
    const { data: comment, error: insertError } = await supabase
      .from("blog_comments")
      .insert({
        blog_id: blogId,
        author,
        message,
      })
      .select("id, author, message, created_at")
      .single();

    if (insertError || !comment) {
      logError("Failed to insert comment", insertError, { blogId, author });
      return NextResponse.json({ error: getSafeDatabaseError(insertError) }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: comment.id,
        author: comment.author,
        message: comment.message,
        date: comment.created_at,
      } satisfies CommentResponse,
      { status: 201 }
    );
  } catch (error) {
    logError("Unexpected error in comment endpoint", error, { blogId });
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
