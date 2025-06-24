import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { blogApi } from '../../services/blogApi';
import BlogCard from '../../components/cards/BlogCard';
import { CalendarIcon, UserIcon, TagIcon, FolderIcon } from '@heroicons/react/24/outline';

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getPostBySlug(slug);
      
      const formattedPost = {
        ...data.post,
        categories: data.post.BlogCategories || [],
        tags: data.post.BlogTags || [],
        author: {
          ...data.post.author,
          username: data.post.author
            ? [data.post.author.first_name, data.post.author.last_name].filter(Boolean).join(' ')
            : 'Unknown Author'
        }
      };
      setPost(formattedPost);
      
      const formattedRelatedPosts = (data.relatedPosts || []).map(p => ({
        ...p,
        categories: p.BlogCategories || [],
        tags: p.BlogTags || [],
        author: {
            ...p.author,
            username: p.author
              ? [p.author.first_name, p.author.last_name].filter(Boolean).join(' ')
              : 'Unknown Author'
        }
      }));
      setRelatedPosts(formattedRelatedPosts);

    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-2 text-gray-600">The post you are looking for does not exist.</p>
        <Link href="/blog">
          <a className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Back to Blog
          </a>
        </Link>
      </div>
    );
  }

  const featuredImage = post.featured_image || '/images/default-blog.jpg';
  const authorName = post.author?.username || 'Unknown Author';
  const publishedAt = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  // Construct image URL with proper fallback
  let imageUrl = '/images/default-blog.jpg';
  if (post.featured_image) {
    if (post.featured_image.startsWith('http://') || post.featured_image.startsWith('https://')) {
      imageUrl = post.featured_image;
    } else if (post.featured_image.startsWith('/')) {
      imageUrl = post.featured_image;
    } else {
      // If it's a relative path, construct the full URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      imageUrl = apiUrl ? `${apiUrl}${post.featured_image}` : post.featured_image;
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Hemny Blog</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hemny.mn/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://hemny.mn/blog/${post.slug}`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative h-96 w-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center space-x-4 text-lg">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{publishedAt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5 text-gray-500" />
              {post.categories?.map((category) => (
                <span key={category.category_id} className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">
                  {category.name}
                </span>
              ))}
            </div>
            {post.tags?.length > 0 && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-gray-500" />
                {post.tags.map((tag) => (
                  <span key={tag.tag_id} className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Featured Image Above Content */}
          {post.featured_image && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-lg">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Post Content */}
          <article className="prose prose-lg max-w-none prose-indigo">
            <div 
              className="whitespace-pre-wrap leading-relaxed text-gray-800"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                You might also like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.post_id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPost; 