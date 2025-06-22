import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '../shared/ImageWithFallback';
import { format } from 'date-fns';

const BlogCard = ({ post, isFeatured = false, className = '', compact = false }) => {
  if (!post) {
    return null;
  }

  const { title, slug, featured_image, created_at, tags, excerpt } = post;
  const postLink = `/blog/${slug}`;
  
  // Construct image URL with proper fallback
  let imageUrl = '/images/default-logo.png';
  if (featured_image) {
    if (featured_image.startsWith('http://') || featured_image.startsWith('https://')) {
      imageUrl = featured_image;
    } else if (featured_image.startsWith('/')) {
      imageUrl = featured_image;
    } else {
      // If it's a relative path, construct the full URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      imageUrl = apiUrl ? `${apiUrl}${featured_image}` : featured_image;
    }
  }

  const CardContent = () => (
    <>
      <div className={compact ? "relative w-full h-40" : "relative w-full h-48 sm:h-56"}>
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
      </div>
      <div className={compact ? "p-3 flex flex-col flex-grow" : "p-5 flex flex-col flex-grow"}>
        {created_at && (
          <p className={compact ? "text-xs text-gray-500 mb-1" : "text-sm text-gray-500 mb-2"}>
            {format(new Date(created_at), 'MMMM dd, yyyy')}
          </p>
        )}
        <h3 className={compact ? "text-base font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300 flex-grow" : "text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300 flex-grow"}>
          {title}
        </h3>
        <div className="mt-2">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag.tag_id} className={compact ? "text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full" : "text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
        </div>
        {excerpt && (
          <p className={compact ? "mt-2 text-xs text-gray-600 line-clamp-2" : "mt-4 text-gray-600 text-sm line-clamp-3"}>{excerpt}</p>
        )}
      </div>
    </>
  );

  if (isFeatured) {
    return (
      <Link href={postLink} legacyBehavior>
        <a className={`group block lg:grid lg:grid-cols-2 lg:gap-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${className}`}>
          <div className="relative w-full h-64 lg:h-full">
            <ImageWithFallback src={imageUrl} alt={title} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
          </div>
          <div className="p-8 flex flex-col">
            {created_at && (
              <p className="text-base text-gray-500 mb-3">
                {format(new Date(created_at), 'MMMM dd, yyyy')}
              </p>
            )}
            <h2 className="text-3xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h2>
            <p className="mt-4 text-gray-600 text-lg flex-grow">
              {excerpt || 'Click to read more...'}
            </p>
            <div className="mt-6">
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag.tag_id} className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <Link href={postLink} legacyBehavior>
      <a className={`group flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full ${compact ? 'w-80' : ''} ${className}`}>
        <CardContent />
      </a>
    </Link>
  );
};

export default BlogCard; 