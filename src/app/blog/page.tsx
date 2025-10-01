"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPosts, type BlogPost } from "@/lib/data";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // In a real app, check authentication here
        setUser(false);
      } catch (e) {
        setUser(false);
      }
    };
    checkUser();
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = getBlogPosts();
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
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img 
                          src={post.cover_image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
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
