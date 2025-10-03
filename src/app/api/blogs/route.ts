import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";
import type { BlogComment, BlogPost } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

interface SupabaseBlogRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url?: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  created_date: string;
  likes: number | null;
  comments?: Array<{
    id: string;
    author: string;
    message: string;
    created_at: string;
  }>;
}

const mapRowToBlogPost = (row: SupabaseBlogRow): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  content: row.content ?? "",
  excerpt: row.excerpt ?? "",
  cover_image_url: row.cover_image_url ?? undefined,
  tags: row.tags ?? [],
  status: row.status,
  featured: row.featured,
  created_date: row.created_date,
  likes: row.likes ?? 0,
  comments: (row.comments ?? []).map((comment) => ({
    id: comment.id,
    author: comment.author,
    message: comment.message,
    date: comment.created_at,
  } satisfies BlogComment)),
});

export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json(getBlogPosts());
  }

  try {
  const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("blogs")
      .select(
        `id, title, slug, content, excerpt, cover_image_url, tags, status, featured, created_date, likes, comments:blog_comments(id, author, message, created_at)`
      )
      .eq("status", "published")
      .order("created_date", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error.message);
      return NextResponse.json(getBlogPosts());
    }

    const mapped = (data as SupabaseBlogRow[] | null | undefined)?.map((row) =>
      mapRowToBlogPost(row)
    ) ?? [];

    return NextResponse.json(mapped satisfies BlogPost[]);
  } catch (error) {
    console.error("Supabase fetch exception:", error);
    return NextResponse.json(getBlogPosts());
  }
}
