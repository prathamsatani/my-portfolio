"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/data";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    // Load liked posts from localStorage
    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) {
      try {
        setLikedPosts(JSON.parse(savedLikes));
      } catch (error) {
        console.error('Failed to parse liked posts from localStorage:', error);
      }
    }

    loadPosts();
  }, []);

  useEffect(() => {
    if (!posts.length) return;
    setLikeCounts(prev => {
      let modified = false;
      const next = { ...prev };
      posts.forEach(post => {
        if (next[post.id] === undefined) {
          next[post.id] = post.likes;
          modified = true;
        }
      });
      return modified ? next : prev;
    });
  }, [posts]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error(`Failed to load blogs: ${response.status}`);
      }
      const data: BlogPost[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts[postId] || false;
    const newLikedState = !isCurrentlyLiked;
    
    // Optimistically update UI
    setLikedPosts(prev => {
      const updated = { ...prev, [postId]: newLikedState };
      localStorage.setItem('likedPosts', JSON.stringify(updated));
      return updated;
    });

    // Optimistically update like count
    setLikeCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (newLikedState ? 1 : -1),
    }));

    try {
      const response = await fetch(`/api/blogs/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unlike: isCurrentlyLiked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post: ${response.status}`);
      }

      const data: { likes: number; warning?: string } = await response.json();
      
      // Update with server response
      setLikeCounts(prev => ({
        ...prev,
        [postId]: data.likes,
      }));

      if (data.warning) {
        setShareFeedback(prev => ({ ...prev, [postId]: data.warning }));
        setTimeout(() => {
          setShareFeedback(prev => {
            if (!(postId in prev)) return prev;
            const next = { ...prev };
            delete next[postId];
            return next;
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      
      // Revert on error
      setLikedPosts(prev => {
        const reverted = { ...prev, [postId]: isCurrentlyLiked };
        localStorage.setItem('likedPosts', JSON.stringify(reverted));
        return reverted;
      });
      
      setLikeCounts(prev => ({
        ...prev,
        [postId]: (prev[postId] ?? 0) + (isCurrentlyLiked ? 1 : -1),
      }));
      
      setShareFeedback(prev => ({ ...prev, [postId]: "Failed to update like" }));
      setTimeout(() => {
        setShareFeedback(prev => {
          if (!(postId in prev)) return prev;
          const next = { ...prev };
          delete next[postId];
          return next;
        });
      }, 3000);
    }
  };
  const handleShare = async (post: BlogPost) => {
    if (typeof window === "undefined") return;
    const postUrl = `${window.location.origin}/blog/${post.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url: postUrl });
        setShareFeedback(prev => ({ ...prev, [post.id]: "Shared!" }));
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        setShareFeedback(prev => ({ ...prev, [post.id]: "Link copied" }));
      } else {
        setShareFeedback(prev => ({ ...prev, [post.id]: "Copy link manually" }));
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      setShareFeedback(prev => ({ ...prev, [post.id]: "Share failed" }));
    }

    setTimeout(() => {
      setShareFeedback(prev => {
        if (!(post.id in prev)) return prev;
        const next = { ...prev };
        delete next[post.id];
        return next;
      });
    }, 3000);
  };

  return (
    <div className="shell section-y">
      <div className="mx-auto max-w-[680px]">
        <header className="border-b border-hairline pb-8">
          <p className="label text-accent">Blog</p>
          <h1 className="mt-4 font-serif text-display-l">Notes on building ML systems</h1>
        </header>

        {loading ? (
          <p className="label py-12 text-muted" role="status">Loading posts…</p>
        ) : posts.length === 0 ? (
          <div className="py-12">
            <h2 className="font-serif text-display-s">No posts yet.</h2>
            <p className="mt-2 text-body-m text-muted">Check back soon.</p>
          </div>
        ) : (
          <ol>
            {posts.map(post => (
              <li key={post.id} className="border-b border-hairline py-10">
                <article>
                  <p className="label text-muted">
                    <time dateTime={post.created_date}>{formatDate(post.created_date)}</time>
                  </p>
                  <h2 className="mt-3 font-serif text-display-m">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && <p className="mt-3 text-body-m text-muted">{post.excerpt}</p>}
                  {post.tags?.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <li key={tag} className="tag">{tag}</li>
                      ))}
                    </ul>
                  )}
                  <div className="label mt-6 flex flex-wrap items-center gap-6 text-muted">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      aria-pressed={Boolean(likedPosts[post.id])}
                      className={likedPosts[post.id] ? "text-accent" : "hover:text-ink"}
                    >
                      {likedPosts[post.id] ? "♥" : "♡"} {likeCounts[post.id] ?? post.likes} likes
                    </button>
                    <Link href={`/blog/${post.slug}#comments`} className="hover:text-ink">
                      {post.comments.length} comments
                    </Link>
                    <button type="button" onClick={() => handleShare(post)} className="hover:text-ink">
                      Share ↗
                    </button>
                    {shareFeedback[post.id] && (
                      <span className="text-accent" aria-live="polite">{shareFeedback[post.id]}</span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
