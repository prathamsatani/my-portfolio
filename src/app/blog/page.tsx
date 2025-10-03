"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/data";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<boolean>(false);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<Record<string, string | undefined>>({});
  const [commentForms, setCommentForms] = useState<Record<string, { author: string; message: string }>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({});
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkUser = async () => {
      try {
        // In a real app, check authentication here
        setUser(false);
      } catch {
        setUser(false);
      }
    };

    // Load liked posts from localStorage
    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) {
      try {
        setLikedPosts(JSON.parse(savedLikes));
      } catch (error) {
        console.error('Failed to parse liked posts from localStorage:', error);
      }
    }

    checkUser();
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

  const formatCommentDate = (dateString: string) => {
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

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = commentForms[postId];
    
    if (!form || !form.author.trim() || !form.message.trim()) {
      setCommentErrors(prev => ({ ...prev, [postId]: "Please fill in all fields" }));
      return;
    }

    setCommentSubmitting(prev => ({ ...prev, [postId]: true }));
    setCommentErrors(prev => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });

    try {
      const response = await fetch(`/api/blogs/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const newComment = await response.json();
      
      // Update posts with new comment
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));

      // Clear form
      setCommentForms(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });

      // Show success message
      setShareFeedback(prev => ({ ...prev, [postId]: "Comment posted!" }));
      setTimeout(() => {
        setShareFeedback(prev => {
          const next = { ...prev };
          delete next[postId];
          return next;
        });
      }, 3000);

    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentErrors(prev => ({ 
        ...prev, 
        [postId]: error instanceof Error ? error.message : "Failed to post comment" 
      }));
    } finally {
      setCommentSubmitting(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      <header className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-6">
            Thoughts on AI & Tech
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploring the frontiers of machine learning, deep learning, and software engineering.
          </p>
          {user && (
            <div className="mt-8">
              <Link href="/blog/manage" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-colors">
                <span>✏️</span>
                Manage Posts
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">No posts yet.</h3>
              <p className="text-gray-600">Check back soon for articles on AI and technology.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map(post => (
                <div key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="block group h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <Image
                          src={post.cover_image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                          unoptimized
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{formatDate(post.created_date)}</span>
                          </div>
                          <span className="flex items-center gap-2 font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Read More →
                          </span>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLike(post.id);
                            }}
                            className={`inline-flex items-center gap-2 font-medium transition-colors ${
                              likedPosts[post.id] 
                                ? 'text-red-600 hover:text-red-700' 
                                : 'text-slate-700 hover:text-teal-600'
                            }`}
                          >
                            <Heart 
                              className={`w-4 h-4 transition-all ${
                                likedPosts[post.id] ? 'fill-red-600' : ''
                              }`} 
                            />
                            <span>{likeCounts[post.id] ?? post.likes}</span>
                          </button>
                          <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments.length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShare(post);
                              }}
                              className="inline-flex items-center gap-2 text-slate-700 hover:text-teal-600 font-medium transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                            {shareFeedback[post.id] && (
                              <span className="text-xs text-teal-600" aria-live="polite">
                                {shareFeedback[post.id]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 space-y-4">
                          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-teal-600" />
                            <span>Comments</span>
                            <span className="text-xs font-medium text-slate-500">({post.comments.length})</span>
                          </h3>
                          
                          {/* Existing Comments */}
                          {post.comments.length > 0 && (
                            <div className="space-y-3 mb-4">
                              {post.comments.map(comment => (
                                <div key={comment.id} className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                  <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-semibold text-slate-900 text-sm">{comment.author}</span>
                                    <span>{formatCommentDate(comment.date)}</span>
                                  </div>
                                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{comment.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Comment Form */}
                          <form 
                            onSubmit={(e) => handleCommentSubmit(post.id, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3"
                          >
                            <h4 className="text-sm font-medium text-slate-900">Leave a comment</h4>
                            <input
                              type="text"
                              placeholder="Your name"
                              value={commentForms[post.id]?.author || ""}
                              onChange={(e) => {
                                e.stopPropagation();
                                setCommentForms(prev => ({
                                  ...prev,
                                  [post.id]: { ...prev[post.id], author: e.target.value, message: prev[post.id]?.message || "" }
                                }));
                              }}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                              required
                            />
                            <textarea
                              placeholder="Your comment (5-500 characters)"
                              value={commentForms[post.id]?.message || ""}
                              onChange={(e) => {
                                e.stopPropagation();
                                setCommentForms(prev => ({
                                  ...prev,
                                  [post.id]: { author: prev[post.id]?.author || "", message: e.target.value }
                                }));
                              }}
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                              required
                            />
                            {commentErrors[post.id] && (
                              <p className="text-xs text-red-600">{commentErrors[post.id]}</p>
                            )}
                            <button
                              type="submit"
                              disabled={commentSubmitting[post.id]}
                              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg transition-colors"
                            >
                              {commentSubmitting[post.id] ? "Posting..." : "Post Comment"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
