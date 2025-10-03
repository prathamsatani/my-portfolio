"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data";
import { Heart, MessageCircle, Share2, ArrowLeft, Calendar, Clock } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
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
    loadPost();
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

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to load blogs");
      }
      const posts: BlogPost[] = await response.json();
      const foundPost = posts.find((p) => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="bg-slate-50 min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="w-full h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-slate-50 min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{estimateReadTime(post.content)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors ${
                  isLiked ? 'text-red-600 hover:text-red-700' : 'hover:text-teal-600'
                }`}
              >
                <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-red-600' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              unoptimized
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg prose-slate max-w-none mb-12">
          <div
            className="whitespace-pre-wrap leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Share & Like Actions */}
        <div className="flex items-center justify-between py-8 border-y border-gray-200 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              isLiked
                ? 'bg-red-50 border-2 border-red-600 text-red-600 hover:bg-red-100'
                : 'bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50'
            }`}
          >
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-red-600' : ''}`} />
            <span>{isLiked ? 'Unlike' : 'Like'} ({likeCount})</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {shareFeedback && (
          <div className="mb-6 p-4 bg-teal-100 text-teal-800 rounded-lg text-center">
            {shareFeedback}
          </div>
        )}

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-teal-600" />
            Comments ({post.comments.length})
          </h2>

          {/* Existing Comments */}
          {post.comments.length > 0 && (
            <div className="space-y-4 mb-8">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white border border-slate-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-900">
                      {comment.author}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatCommentDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Leave a comment
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="author"
                  value={commentForm.author}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your comment
                </label>
                <textarea
                  id="message"
                  value={commentForm.message}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Share your thoughts... (5-500 characters)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {commentForm.message.length}/500 characters
                </p>
              </div>

              {commentError && (
                <p className="text-sm text-red-600">{commentError}</p>
              )}

              <button
                type="submit"
                disabled={commentSubmitting}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
