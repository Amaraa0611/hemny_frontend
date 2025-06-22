import axios from 'axios';
import { axiosInstance } from './api';

export const blogApi = {
  // Fetch all published blog posts (with optional params)
  getPosts: async (filters: { tag?: string; category?: string; } = {}) => {
    try {
      const response = await axiosInstance.get('/blog/posts', { params: filters });
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.error('Unable to connect to the server. Is it running?');
        } else if (error.response) {
          console.error('Server responded with:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.message);
        }
      }
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Blog search
  searchPosts: async (params: any = {}) => {
    try {
      const response = await axiosInstance.get('/blog/search', { params });
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  },

  // Fetch a single blog post by slug
  getPostBySlug: async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/blog/posts/${slug}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw error;
    }
  },

  // Admin: Fetch a single blog post by ID
  getPostById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/blog/admin/posts/${id}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch all blog categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/blog/categories');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  },

  // Fetch all blog tags
  getTags: async () => {
    try {
      const response = await axiosInstance.get('/blog/tags');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      throw error;
    }
  },

  // Admin: Create a new post
  createPost: async (data: any) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'content', 'status'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate data types
      if (data.categories && !Array.isArray(data.categories)) {
        throw new Error('Categories must be an array');
      }
      if (data.tags && !Array.isArray(data.tags)) {
        throw new Error('Tags must be an array');
      }

      // Validate status
      const validStatuses = ['draft', 'published', 'archived'];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      // Validate published_at format if present
      if (data.published_at && !isValidDate(data.published_at)) {
        throw new Error('Invalid published_at date format');
      }

      const response = await axiosInstance.post('/blog/posts', data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating blog post:', {
          status: error.response?.status,
          data: error.response?.data,
          requestData: data
        });
      } else if (error instanceof Error) {
        console.error('Validation error:', error.message);
      }
      throw error;
    }
  },

  // Admin: Update a post
  updatePost: async (id: string, data: any) => {
    try {
      console.log('Sending update request to:', `/blog/admin/posts/${id}`);
      console.log('Update data:', data);
      const response = await axiosInstance.put(`/blog/admin/posts/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating blog post:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          requestData: data,
          url: `/blog/admin/posts/${id}`
        });
      } else {
        console.error('Error updating blog post:', error);
      }
      throw error;
    }
  },

  // Admin: Delete a post
  deletePost: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/blog/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Admin: Create a new category
  createCategory: async (data: any) => {
    try {
      const response = await axiosInstance.post('/blog/categories', data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog category:', error);
      throw error;
    }
  },

  // Admin: Update a category
  updateCategory: async (id: string, data: any) => {
    try {
      const response = await axiosInstance.put(`/blog/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating blog category:', error);
      throw error;
    }
  },

  // Admin: Delete a category
  deleteCategory: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/blog/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog category:', error);
      throw error;
    }
  },

  // Admin: Create a new tag
  createTag: async (data: any) => {
    try {
      const response = await axiosInstance.post('/blog/tags', data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog tag:', error);
      throw error;
    }
  },

  // Admin: Update a tag
  updateTag: async (id: string, data: any) => {
    try {
      const response = await axiosInstance.put(`/blog/tags/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating blog tag:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          requestData: data,
          url: `/blog/tags/${id}`,
        });
      } else {
        console.error('An unexpected error occurred while updating tag:', error);
      }
      throw error;
    }
  },

  // Admin: Delete a tag
  deleteTag: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/blog/tags/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog tag:', error);
      throw error;
    }
  },
};

// Helper function to validate date format
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}; 