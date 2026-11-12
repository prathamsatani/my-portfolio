"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import type { BlogPost } from "@/lib/data";
import "highlight.js/styles/github.css";
import "./markdown.css";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentForm, setCommentForm] = useState({ author: "", message: "" });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to load blog post:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
      
      // Check if this post is liked in localStorage
      const savedLikes = localStorage.getItem('likedPosts');
      if (savedLikes) {
        try {
          const likedPosts = JSON.parse(savedLikes);
          setIsLiked(likedPosts[post.id] || false);
        } catch (error) {
          console.error('Failed to parse liked posts:', error);
        }
      }
    }
  }, [post]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLike = async () => {
    if (!post) return;
    
    const newLikedState = !isLiked;
    
    // Optimistically update UI
    setIsLiked(newLikedState);
    setLikeCount(prev => prev + (newLikedState ? 1 : -1));
    
    // Update localStorage
    const savedLikes = localStorage.getItem('likedPosts');
    const likedPosts = savedLikes ? JSON.parse(savedLikes) : {};
    likedPosts[post.id] = newLikedState;
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    
    try {
      const response = await fetch(`/api/blogs/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unlike: isLiked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} post: ${response.status}`);
      }

      const data: { likes: number; warning?: string } = await response.json();
      setLikeCount(data.likes);

      if (data.warning) {
        setShareFeedback(data.warning);
        setTimeout(() => setShareFeedback(""), 3000);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(prev => prev + (isLiked ? 1 : -1));
      
      const savedLikes = localStorage.getItem('likedPosts');
      const likedPosts = savedLikes ? JSON.parse(savedLikes) : {};
      likedPosts[post.id] = isLiked;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
      setShareFeedback("Failed to update like");
      setTimeout(() => setShareFeedback(""), 3000);
    }
  };

  const handleShare = async () => {
    if (!post || typeof window === "undefined") return;
    const postUrl = `${window.location.origin}/blog/${post.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url: postUrl });
        setShareFeedback("Shared!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        setShareFeedback("Link copied to clipboard");
      } else {
        setShareFeedback("Copy link manually: " + postUrl);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      setShareFeedback("Share failed");
    }

    setTimeout(() => setShareFeedback(""), 3000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    if (!commentForm.author.trim() || !commentForm.message.trim()) {
      setCommentError("Please fill in all fields");
      return;
    }

    setCommentSubmitting(true);
    setCommentError("");

    try {
      const response = await fetch(`/api/blogs/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Failed to post comment");
      }

      const newComment = await response.json();

      // Update post with new comment
      setPost((prev) =>
        prev
          ? { ...prev, comments: [...prev.comments, newComment] }
          : null
      );

      // Clear form
      setCommentForm({ author: "", message: "" });

      // Show success message
      setShareFeedback("Comment posted!");
      setTimeout(() => setShareFeedback(""), 3000);
    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentError(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="shell section-y label text-muted" role="status">
        Loading post…
      </p>
    );
  }

  if (notFound || !post) {
    return (
      <div className="shell section-y">
        <div className="mx-auto max-w-[680px]">
          <h1 className="font-serif text-display-l">Post not found</h1>
          <p className="mt-4 text-body-m text-muted">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/blog" className="btn mt-8">
            Back to blog →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="shell section-y">
      <div className="mx-auto max-w-[680px]">
        <header className="border-b border-hairline pb-8">
          <Link href="/blog" className="label text-muted hover:text-ink">
            ← All posts
          </Link>
          <h1 className="mt-6 font-serif text-display-l">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-body-l text-muted">{post.excerpt}</p>}
          <p className="label mt-6 flex flex-wrap gap-x-6 gap-y-2 text-muted">
            <time dateTime={post.created_date}>{formatDate(post.created_date)}</time>
            <span>{estimateReadTime(post.content)}</span>
            <span>{likeCount} likes</span>
            <span>{post.comments.length} comments</span>
          </p>
          {post.tags && post.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.cover_image_url && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-[4px] bg-hairline">
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 720px) 100vw, 680px"
              unoptimized
            />
          </div>
        )}

        <div className="prose mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-y border-hairline py-8">
          <button type="button" onClick={handleLike} aria-pressed={isLiked} className={`btn ${isLiked ? "btn-primary" : ""}`}>
            {isLiked ? "♥ Liked" : "♡ Like"} ({likeCount})
          </button>
          <button type="button" onClick={handleShare} className="btn">
            Share →
          </button>
          {shareFeedback && (
            <p className="label text-accent" aria-live="polite">
              {shareFeedback}
            </p>
          )}
        </div>

        <section id="comments" aria-labelledby="comments-title" className="mt-12">
          <h2 id="comments-title" className="font-serif text-display-s">
            Comments ({post.comments.length})
          </h2>

          {post.comments.length > 0 && (
            <ol className="mt-6">
              {post.comments.map((comment) => (
                <li key={comment.id} className="border-b border-hairline py-6">
                  <p className="label flex justify-between gap-4 text-muted">
                    <span className="text-ink">{comment.author}</span>
                    <time dateTime={comment.date}>{formatCommentDate(comment.date)}</time>
                  </p>
                  <p className="mt-3 text-body-m">{comment.message}</p>
                </li>
              ))}
            </ol>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-10 space-y-8">
            <h3 className="label text-muted">Leave a comment</h3>
            <div>
              <label htmlFor="author" className="label text-muted">
                Your name
              </label>
              <input
                type="text"
                id="author"
                value={commentForm.author}
                onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                className="mt-2 w-full border-0 border-b border-ink bg-transparent py-2 text-body-m"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="label text-muted">
                Your comment
              </label>
              <textarea
                id="message"
                value={commentForm.message}
                onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                rows={4}
                aria-describedby="message-count"
                className="mt-2 w-full resize-none border-0 border-b border-ink bg-transparent py-2 text-body-m"
                required
              />
              <p id="message-count" className="label mt-2 text-muted">
                {commentForm.message.length}/500 characters (min 5)
              </p>
            </div>

            {commentError && (
              <p role="alert" className="text-body-s text-accent">
                {commentError}
              </p>
            )}

            <button type="submit" disabled={commentSubmitting} className="btn btn-primary">
              {commentSubmitting ? "Posting…" : "Post comment →"}
            </button>
          </form>
        </section>
      </div>
    </article>
  );
}
