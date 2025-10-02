import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";
import type { BlogPost } from "@/lib/data";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

interface LikeResponse {
  likes: number;
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const blogId = params.id;
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
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("likes")
      .eq("id", blogId)
      .single();

    if (error) {
      console.error("Supabase likes fetch error:", error.message);
      return NextResponse.json({ message: "Failed to load blog" }, { status: 500 });
    }

    const nextLikes = (data?.likes ?? 0) + 1;
    const { error: updateError } = await supabase
      .from("blogs")
      .update({ likes: nextLikes })
      .eq("id", blogId);

    if (updateError) {
      console.error("Supabase likes update error:", updateError.message);
      return NextResponse.json({ message: "Failed to update likes" }, { status: 500 });
    }

    return NextResponse.json({ likes: nextLikes } satisfies LikeResponse);
  } catch (error) {
    console.error("Supabase like exception:", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
