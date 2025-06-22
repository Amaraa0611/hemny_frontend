import React from 'react';
import BlogCard from './BlogCard';

const BlogTree = ({ tags = [], posts = [] }) => {
  // Build a map of posts by tag
  const postsByTag = {};
  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      if (!postsByTag[tag.tag_id]) postsByTag[tag.tag_id] = [];
      postsByTag[tag.tag_id].push(post);
    });
  });

  if (!tags.length || !posts.length) {
    return <div className="text-center text-gray-400 py-8">No blog tree data to display.</div>;
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Mobile: Horizontal flow with overflow */}
      <div className="lg:hidden overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {tags.map((tag) => (
            <div key={tag.tag_id} className="flex flex-col items-center w-80 flex-shrink-0">
              <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow font-bold text-lg text-center">
                #{tag.name}
              </div>
              {tag.description && (
                <p className="mt-2 text-center text-gray-500 text-sm max-w-xs">{tag.description}</p>
              )}
              {/* SVG line down to posts */}
              <svg height="40" width="2" className="my-2">
                <line x1="1" y1="0" x2="1" y2="40" stroke="#6366f1" strokeWidth="2" />
              </svg>
              {/* Posts Row as BlogCards */}
              <div className="flex flex-col gap-4">
                {(postsByTag[tag.tag_id] || []).map((post, idx, arr) => (
                  <div key={post.post_id} className="flex flex-col items-center">
                    {/* Arrow from tag to each post */}
                    {idx > 0 && (
                      <svg height="32" width="2" className="my-0">
                        <line x1="1" y1="0" x2="1" y2="32" stroke="#6366f1" strokeWidth="2" />
                      </svg>
                    )}
                    <BlogCard post={post} compact={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden lg:flex flex-col items-center gap-16">
        <div className="flex gap-16 relative z-10">
          {tags.map((tag) => (
            <div key={tag.tag_id} className="flex flex-col items-center w-80">
              <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow font-bold text-lg">
                #{tag.name}
              </div>
              {tag.description && (
                <p className="mt-2 text-center text-gray-500 text-sm">{tag.description}</p>
              )}
              {/* SVG line down to posts */}
              <svg height="40" width="2" className="my-2">
                <line x1="1" y1="0" x2="1" y2="40" stroke="#6366f1" strokeWidth="2" />
              </svg>
              {/* Posts Row as BlogCards */}
              <div className="flex flex-col gap-4">
                {(postsByTag[tag.tag_id] || []).map((post, idx, arr) => (
                  <div key={post.post_id} className="flex flex-col items-center">
                    {/* Arrow from tag to each post */}
                    {idx > 0 && (
                      <svg height="32" width="2" className="my-0">
                        <line x1="1" y1="0" x2="1" y2="32" stroke="#6366f1" strokeWidth="2" />
                      </svg>
                    )}
                    <BlogCard post={post} compact={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogTree; 