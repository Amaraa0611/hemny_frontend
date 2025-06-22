import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { blogApi } from '../../../../services/blogApi';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { generateBothSlugs } from '../../../../utils/slugUtils';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const initialState = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: '',
  status: 'draft',
  published_at: '',
  categories: [],
  tags: [],
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  structured_data: '',
};

const BlogEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchCategories();
      fetchTags();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const post = await blogApi.getPostById(id);
      
      // Map the post data to form fields
      const formData = {
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        status: post.status || 'draft',
        published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
        categories: (post.BlogCategories || []).map(cat => cat.category_id.toString()),
        tags: (post.BlogTags || []).map(tag => tag.tag_id.toString()),
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
        canonical_url: post.canonical_url || '',
        og_title: post.og_title || '',
        og_description: post.og_description || '',
        og_image: post.og_image || '',
        twitter_title: post.twitter_title || '',
        twitter_description: post.twitter_description || '',
        twitter_image: post.twitter_image || '',
        structured_data: post.structured_data ? JSON.stringify(post.structured_data, null, 2) : '',
      };
      
      setForm(formData);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load blog post.');
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await blogApi.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const fetchTags = async () => {
    try {
      const data = await blogApi.getTags();
      setTags(data || []);
    } catch (err) {
      setError('Failed to load tags');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));

    // Auto-generate slug when title changes
    if (name === 'title' && value.trim()) {
      const { slug, englishSlug, isCyrillic } = generateBothSlugs(value);
      setForm((prev) => ({
        ...prev,
        slug: slug,
        // Store English slug in a hidden field or state for backend
        englishSlug: englishSlug
      }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, [field]: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Prepare postData with correct types
      const postData = {
        ...form,
        categories: form.categories.map(Number),
        tags: form.tags.map(Number),
      };
      // Remove empty fields
      Object.keys(postData).forEach(
        (key) =>
          (Array.isArray(postData[key]) && postData[key].length === 0) ||
          (typeof postData[key] === 'string' && postData[key].trim() === '') ||
          postData[key] === undefined
            ? delete postData[key]
            : null
      );
      if (form.structured_data) {
        postData.structured_data = JSON.parse(form.structured_data);
      }
      console.log('Updating blog post:', postData);
      await blogApi.updatePost(id, postData);
      setSuccess('Blog post updated successfully!');
      // Optionally redirect back to blog list
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (err) {
      console.error('Error updating blog post:', err);
      if (err.response?.data?.message) {
        setError(`Failed to update blog post: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Failed to update blog post: ${err.message}`);
      } else {
        setError('Failed to update blog post.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog Post">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/admin/blog')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            {form.title && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="font-medium">Primary (Cyrillic):</span>
                    <span className="ml-2 text-indigo-600">{form.slug}</span>
                  </div>
                  <div>
                    <span className="font-medium">Fallback (English):</span>
                    <span className="ml-2 text-gray-500">{form.englishSlug}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Content *</label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(content) => setForm(prev => ({ ...prev, content }))}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Featured Image URL</label>
            <input name="featured_image" value={form.featured_image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Status *</label>
            <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Published At</label>
            <input name="published_at" value={form.published_at} onChange={handleChange} type="datetime-local" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Categories *</label>
            <select name="categories" value={form.categories} onChange={(e) => handleMultiSelect(e, 'categories')} multiple required className="w-full border rounded px-3 py-2">
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Tags *</label>
            <select name="tags" value={form.tags} onChange={(e) => handleMultiSelect(e, 'tags')} multiple required className="w-full border rounded px-3 py-2">
              {tags.map((tag) => (
                <option key={tag.tag_id} value={tag.tag_id}>{tag.name}</option>
              ))}
            </select>
          </div>
          {/* Meta fields (optional) */}
          <details className="border rounded p-3">
            <summary className="cursor-pointer font-medium">Meta & SEO Fields</summary>
            <div className="mt-3 space-y-3">
              <input name="meta_title" value={form.meta_title} onChange={handleChange} placeholder="Meta Title" className="w-full border rounded px-3 py-2" />
              <input name="meta_description" value={form.meta_description} onChange={handleChange} placeholder="Meta Description" className="w-full border rounded px-3 py-2" />
              <input name="meta_keywords" value={form.meta_keywords} onChange={handleChange} placeholder="Meta Keywords" className="w-full border rounded px-3 py-2" />
              <input name="canonical_url" value={form.canonical_url} onChange={handleChange} placeholder="Canonical URL" className="w-full border rounded px-3 py-2" />
              <input name="og_title" value={form.og_title} onChange={handleChange} placeholder="OG Title" className="w-full border rounded px-3 py-2" />
              <input name="og_description" value={form.og_description} onChange={handleChange} placeholder="OG Description" className="w-full border rounded px-3 py-2" />
              <input name="og_image" value={form.og_image} onChange={handleChange} placeholder="OG Image URL" className="w-full border rounded px-3 py-2" />
              <input name="twitter_title" value={form.twitter_title} onChange={handleChange} placeholder="Twitter Title" className="w-full border rounded px-3 py-2" />
              <input name="twitter_description" value={form.twitter_description} onChange={handleChange} placeholder="Twitter Description" className="w-full border rounded px-3 py-2" />
              <input name="twitter_image" value={form.twitter_image} onChange={handleChange} placeholder="Twitter Image URL" className="w-full border rounded px-3 py-2" />
              <textarea name="structured_data" value={form.structured_data} onChange={handleChange} placeholder="Structured Data (JSON)" className="w-full border rounded px-3 py-2" />
            </div>
          </details>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Post'}
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/admin/blog')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogEditPage; 