"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCcw, 
  Save,
  FileText
} from "lucide-react";
import type { BlogPost } from "@/lib/data";
import {
  SectionHeader,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  SecondaryButton,
  ListCard,
  Alert,
} from "@/components/admin/AdminUIComponents";
import { ImageUpload, uploadFileToSupabase } from "@/components/admin/FileUpload";

interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string;
  status: "draft" | "published";
  featured: boolean;
}

const emptyBlogForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  tags: "",
  status: "draft",
  featured: false,
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [blogMessage, setBlogMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Store pending file
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);

  const loadData = async () => {
    try {
      const blogsData = await fetchJson<BlogPost[]>("/api/blogs");
      setBlogs(blogsData);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetBlogForm = () => {
    setBlogForm(emptyBlogForm);
    setPendingCoverImage(null);
  };

  const convertTagsToString = (tags?: string[]) => (tags ?? []).join(", ");

  const handleBlogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlogMessage(null);
    setIsSaving(true);

    try {
      let coverImageUrl = blogForm.cover_image_url;

      // Upload pending file first if exists
      if (pendingCoverImage) {
        setBlogMessage("Uploading cover image...");
        coverImageUrl = await uploadFileToSupabase(pendingCoverImage, "images/blogs");
        setPendingCoverImage(null);
      }

      const payload = {
        title: blogForm.title,
        slug: blogForm.slug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        cover_image_url: coverImageUrl,
        tags: blogForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: blogForm.status,
        featured: blogForm.featured,
      };

      setBlogMessage("Saving blog post...");
      const response = await fetch(
        blogForm.id ? `/api/admin/blogs/${blogForm.id}` : "/api/admin/blogs",
        {
          method: blogForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save blog");
      }

      setBlogMessage(blogForm.id ? "Blog updated successfully!" : "Blog created successfully!");
      resetBlogForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setBlogMessage(error instanceof Error ? error.message : "Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  const startBlogEdit = (blog: BlogPost) => {
    setBlogForm({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      content: blog.content ?? "",
      cover_image_url: blog.cover_image_url ?? "",
      tags: convertTagsToString(blog.tags),
      status: blog.status,
      featured: blog.featured,
    });
    // Scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;

    const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setBlogMessage(data.error ?? "Failed to delete blog");
      return;
    }

    setBlogMessage("Blog deleted");
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-slate-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Blogs" 
          description="Create, update, and curate your long-form content." 
          icon={FileText}
        />
        
        <AnimatePresence mode="wait">
          {blogMessage && (
            <Alert 
              message={blogMessage} 
              onClose={() => setBlogMessage("")} 
            />
          )}
        </AnimatePresence>

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg mb-6">
          <form onSubmit={handleBlogSubmit} className="space-y-6">
            {/* Cover Image at Top */}
            <div className="mb-8">
              <ImageUpload
                label="Cover Image"
                currentFile={blogForm.cover_image_url}
                onFileSelect={(fileOrUrl) => {
                  if (fileOrUrl instanceof File) {
                    setPendingCoverImage(fileOrUrl);
                  } else {
                    setBlogForm((prev) => ({ ...prev, cover_image_url: fileOrUrl }));
                  }
                }}
                onFileRemove={() => {
                  setPendingCoverImage(null);
                  setBlogForm((prev) => ({ ...prev, cover_image_url: "" }));
                }}
                directory="images/blogs"
                description="Upload a cover image for your blog post (recommended: 1200x630px)"
                maxSize={10}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Title"
                value={blogForm.title}
                onChange={(value) => setBlogForm((prev) => ({ ...prev, title: value }))}
                required
              />
              <Input
                label="Slug"
                helperText="Lowercase with hyphens (e.g. supabase-integration-guide)"
                value={blogForm.slug}
                onChange={(value) => setBlogForm((prev) => ({ ...prev, slug: value }))}
                required
              />
            </div>
            <Input
              label="Excerpt"
              value={blogForm.excerpt}
              onChange={(value) => setBlogForm((prev) => ({ ...prev, excerpt: value }))}
              placeholder="Short summary displayed in the blog list"
            />
            <Textarea
              label="Content"
              value={blogForm.content}
              onChange={(value) => setBlogForm((prev) => ({ ...prev, content: value }))}
              rows={8}
            />
            <Input
              label="Tags"
              value={blogForm.tags}
              onChange={(value) => setBlogForm((prev) => ({ ...prev, tags: value }))}
              placeholder="Comma separated (e.g. nextjs, supabase)"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Status"
                value={blogForm.status}
                onChange={(value) =>
                  setBlogForm((prev) => ({ ...prev, status: value as "draft" | "published" }))
                }
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
              <Checkbox
                label="Featured"
                checked={blogForm.featured}
                onChange={(checked) =>
                  setBlogForm((prev) => ({ ...prev, featured: checked }))
                }
              />
            </div>

            {/* Optional: Manual URL Entry */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 list-none flex items-center gap-2">
                <span className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
                Advanced: Manual Cover Image URL
              </summary>
              <div className="mt-2 pl-6 border-l-2 border-teal-200 bg-slate-50/50 rounded-r-xl p-4">
                <Input
                  label="Cover Image URL"
                  value={blogForm.cover_image_url}
                  onChange={(value) => setBlogForm((prev) => ({ ...prev, cover_image_url: value }))}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </details>

            <div className="flex flex-wrap gap-3">
              <Button 
                type="submit" 
                icon={<Save className="h-4 w-4" />}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : blogForm.id ? "Update Blog" : "Create Blog"}
              </Button>
              {!isSaving && (
                <SecondaryButton
                  type="button"
                  icon={<RefreshCcw className="h-4 w-4" />}
                  onClick={resetBlogForm}
                >
                  Reset
                </SecondaryButton>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Existing blogs</h3>
          <div className="space-y-3">
            {blogs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No blog posts yet.</p>
            ) : (
              blogs.map((blog, index) => (
                <ListCard
                  key={blog.id}
                  title={blog.title}
                  subtitle={`${blog.status === "published" ? "Published" : "Draft"} · ${blog.slug}`}
                  badges={blog.featured ? ["Featured"] : []}
                  onEdit={() => startBlogEdit(blog)}
                  onDelete={() => deleteBlog(blog.id)}
                  delay={index * 0.05}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
