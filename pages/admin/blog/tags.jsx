import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/layout/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { blogApi } from '../../../services/blogApi';

const TagsPage = () => {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const data = await blogApi.getTags();
      setTags(data || []);
    } catch (err) {
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingTag) {
        await blogApi.updateTag(editingTag.tag_id, formData);
        setSuccess('Tag updated successfully!');
      } else {
        await blogApi.createTag(formData);
        setSuccess('Tag created successfully!');
      }
      setIsModalOpen(false);
      setEditingTag(null);
      setFormData({ name: '', description: '', slug: '' });
      fetchTags();
    } catch (err) {
      let errorMessage = editingTag ? 'Failed to update tag' : 'Failed to create tag';
      if (err.response?.data?.message) {
        errorMessage = `${errorMessage}: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors.map(e => e.msg).join(', ');
        errorMessage = `${errorMessage}: ${validationErrors}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || '',
      slug: tag.slug || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (tagId) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;

    try {
      await blogApi.deleteTag(tagId);
      setSuccess('Tag deleted successfully!');
      fetchTags();
    } catch (err) {
      setError('Failed to delete tag');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'name' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Tags</h1>
        <button
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: '', description: '', slug: '' });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Tag
        </button>
      </div>

      {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">{success}</div>}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tags.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No tags found. Click "Add Tag" to create one.
              </li>
            ) : (
              tags.map((tag) => (
                <li key={tag.tag_id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {tag.name}
                      </h3>
                      {tag.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {tag.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.tag_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-medium mb-4">
              {editingTag ? 'Edit Tag' : 'Add Tag'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTag(null);
                    setFormData({ name: '', description: '', slug: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminTagsPage = () => {
  return (
    <AdminLayout>
      <TagsPage />
    </AdminLayout>
  );
};

export default AdminTagsPage; 