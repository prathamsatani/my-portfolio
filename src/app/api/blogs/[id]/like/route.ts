import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";
import type { BlogPost } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { logError, getSafeDatabaseError } from "@/lib/errors";

const hasSupabaseConfig = Boolean(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

interface LikeResponse {
  likes: number;
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: blogId } = await context.params;
  if (!blogId) {
    return NextResponse.json({ message: "Blog id is required" }, { status: 400 });
  }

  if (!hasSupabaseConfig) {
    const fallbackBlog = getBlogPosts().find((blog: BlogPost) => blog.id === blogId);
    return NextResponse.json(
      { likes: fallbackBlog?.likes ?? 0, warning: "Supabase not configured. Like counts are read-only in fallback mode." },
      { status: 200 }
    );
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Like request for blog:', blogId);
    }
    const { data, error } = await supabase
      .from("blogs")
      .select("likes")
      .eq("id", blogId)
      .single();

    if (error) {
      logError("Failed to fetch blog likes", error, { blogId });
      
      // If blog not found in Supabase, it might be a JSON fallback ID
      if (error.code === 'PGRST116' || error.message?.includes('not found')) {
        const fallbackBlog = getBlogPosts().find((blog: BlogPost) => blog.id === blogId);
        if (fallbackBlog) {
          return NextResponse.json(
            { likes: fallbackBlog.likes, warning: "Blog found in fallback data. Likes are read-only." },
            { status: 200 }
          );
        }
      }
      
      return NextResponse.json({ message: getSafeDatabaseError(error) }, { status: 500 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Current likes:', data?.likes, 'Next likes:', (data?.likes ?? 0) + 1);
    }

    const nextLikes = (data?.likes ?? 0) + 1;
    const { error: updateError } = await supabase
      .from("blogs")
      .update({ likes: nextLikes })
      .eq("id", blogId);

    if (updateError) {
      logError("Failed to update blog likes", updateError, { blogId, nextLikes });
      return NextResponse.json({ message: getSafeDatabaseError(updateError) }, { status: 500 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Successfully updated likes to:', nextLikes);
    }

    return NextResponse.json({ likes: nextLikes } satisfies LikeResponse);
  } catch (error) {
    logError("Unexpected error in like endpoint", error, { blogId });
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
