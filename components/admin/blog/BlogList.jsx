import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { blogApi } from '../../../services/blogApi';

const BlogList = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getPosts();
        setBlogs(
          (data.posts || []).map(post => ({
            ...post,
            categories: post.BlogCategories || [],
            tags: post.BlogTags || [],
            author: {
              ...post.author,
              username: post.author
                ? [post.author.first_name, post.author.last_name].filter(Boolean).join(' ')
                : 'Unknown Author'
            }
          }))
        );
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleAddBlog = () => {
    router.push('/admin/blog-create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button
          onClick={handleAddBlog}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Blog Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogs.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No blog posts found. Click "Add Blog Post" to create one.
              </li>
            ) : (
              blogs.map((blog) => (
                <li key={blog.post_id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {blog.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {blog.excerpt}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Created: {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                        {blog.updatedAt && (
                          <span className="ml-4">
                            Updated: {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/admin/blog/${blog.post_id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogList; 