"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Save, X, Loader2 } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url?: string;
  tags?: string[];
  status: "draft" | "published";
}

interface BlogFormProps {
  post?: BlogPost;
  onSave: () => void;
  onCancel: () => void;
}

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

export default function BlogForm({ post, onSave, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    cover_image_url: post?.cover_image_url || '',
    tags: post?.tags?.join(', ') || '',
    status: post?.status || 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // If it's a new post, generate slug from title as user types
    if (!post) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, post]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // In a real app, upload to a file storage service
        const fileUrl = URL.createObjectURL(file);
        handleInputChange('cover_image_url', fileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSave = {
      ...formData,
      tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
    };

    try {
      // In a real app, save to an API
      console.log('Saving blog post:', dataToSave);
      onSave();
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-slate-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h1>
            <div className="flex gap-4">
              <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-6 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {post ? 'Save Changes' : 'Publish Post'}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <label className="font-medium block mb-2">Title</label>
              <input 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Your blog post title"
                className="w-full text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-medium block mb-2">Slug</label>
              <input 
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="your-blog-post-title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                readOnly={!!post}
              />
            </div>
            <div>
              <label className="font-medium">Content</label>
              <div className="mt-2 bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={value => handleInputChange('content', value)}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>
             <div>
              <label className="font-medium block mb-2">Excerpt</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="A short summary of your post"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="font-medium block mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="max-w-xs px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={isUploading}
                />
                {isUploading && <Loader2 className="animate-spin" />}
              </div>
              {formData.cover_image_url && (
                <div className="mt-4">
                  <img src={formData.cover_image_url} alt="Cover" className="w-48 h-auto rounded-lg" />
                </div>
              )}
            </div>
             <div>
              <label className="font-medium block mb-2">Tags (comma-separated)</label>
              <input 
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., AI, Machine Learning, Python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
             <div>
              <label className="font-medium block mb-2">Status</label>
               <select 
                 value={formData.status} 
                 onChange={(e) => handleInputChange('status', e.target.value)}
                 className="w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
               >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}