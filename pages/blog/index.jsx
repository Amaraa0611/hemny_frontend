import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BlogCard from '../../components/blog/BlogCard';
import { blogApi } from '../../services/blogApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getPosts } from '../../services/blogApi';
import { categoryService } from '../../services/categoryService';
import Link from 'next/link';
import BlogTree from '../../components/blog/BlogTree';

const BlogList = () => {
  const router = useRouter();
  const { tag: selectedTag, category: selectedCategory } = router.query;

  const [posts, setPosts] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const { posts: rawPosts, activeTag: tagData, activeCategory: categoryData } = await blogApi.getPosts({
          tag: selectedTag,
          category: selectedCategory,
        });
        const formattedPosts = (rawPosts || []).map(post => ({
          ...post,
          tags: post.BlogTags || [],
          categories: post.BlogCategories || [],
        }));
        setPosts(formattedPosts);
        setActiveTag(tagData);
        setActiveCategory(categoryData);
        console.log('Fetched posts:', formattedPosts);
      } catch (error) {
        console.error('Failed to fetch posts or page data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSideData = async () => {
      try {
        const [catData, tagsData] = await Promise.all([
          blogApi.getCategories(),
          blogApi.getTags(),
        ]);
        console.log('Raw categories:', catData);
        console.log('Raw tags:', tagsData);
        // Handle both array and wrapped object responses
        setCategories(Array.isArray(catData) ? catData : catData.data || []);
        setTags(Array.isArray(tagsData) ? tagsData : tagsData.tags || []);
      } catch (error) {
        console.error('Failed to fetch side data:', error);
      }
    };

    fetchPageData();
    fetchSideData();
  }, [selectedTag, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  const isFiltered = selectedTag || selectedCategory;

  const SkeletonCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-md"></div>
        <div className="mt-4">
            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
            <div className="mt-2 w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isFiltered ? (
          <main>
            <div className="py-8 sm:py-16 bg-white rounded-xl shadow-sm mb-8 sm:mb-12">
              <div className="text-center px-4">
                {activeTag && (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                      Posts tagged <span className="text-indigo-600">#{activeTag.name}</span>
                    </h1>
                    {activeTag.description && <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-500">{activeTag.description}</p>}
                  </>
                )}
                {activeCategory && (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                      <span className="text-indigo-600">{activeCategory.name}</span>
                    </h1>
                    {activeCategory.description && <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-500">{activeCategory.description}</p>}
                  </>
                )}
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.post_id} post={post} />
                ))}
              </div>
            )}
          </main>
        ) : (
          <>
            {!isFiltered && (
              <>
                <div className="text-center mb-8 sm:mb-12 px-4">
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">From the Blog</h1>
                  <p className="mt-3 text-lg sm:text-xl text-gray-500 sm:mt-4">Latest news, articles, and resources from our team.</p>
                </div>
                <BlogTree tags={tags} posts={posts} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList; 