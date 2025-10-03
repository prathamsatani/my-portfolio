import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";
import type { BlogComment, BlogPost } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const hasSupabaseConfig = Boolean(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const identifier = params.id;

  if (!hasSupabaseConfig) {
    // Fallback to JSON data
    const posts = getBlogPosts();
    const post = posts.find(
      (p) => p.id === identifier || p.slug === identifier
    );

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    
    // Try to find by slug first, then by ID
    let query = supabase
      .from("blogs")
      .select(
        `id, title, slug, content, excerpt, cover_image_url, tags, status, featured, created_date, likes, comments:blog_comments(id, author, message, created_at)`
      )
      .eq("status", "published");

    // Check if identifier looks like a UUID (for ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    if (isUUID) {
      query = query.eq("id", identifier);
    } else {
      query = query.eq("slug", identifier);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Supabase fetch error:", error.message);
      
      // Fallback to JSON data
      const posts = getBlogPosts();
      const post = posts.find(
        (p) => p.id === identifier || p.slug === identifier
      );

      if (!post) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(post);
    }

    if (!data) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const post = mapRowToBlogPost(data as SupabaseBlogRow);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Supabase fetch exception:", error);
    
    // Fallback to JSON data
    const posts = getBlogPosts();
    const post = posts.find(
      (p) => p.id === identifier || p.slug === identifier
    );

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  }
}
