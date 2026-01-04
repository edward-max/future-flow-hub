
import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, settings, isLoading } = useApp();
  
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ${settings.site_name}`;
    }
  }, [post, settings]);

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
  if (!post) return <Navigate to="/blog" />;

  return (
    <article className="pb-20 animate-fade-in">
      <div className="bg-gray-50 dark:bg-gray-800 py-16 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--primary)] mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Calendar size={16} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
            </span>
            <span className="flex items-center gap-2">
              <User size={16} /> {post.author || 'Editorial Team'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="w-full h-auto rounded-2xl shadow-xl mb-12" />
        )}
        
        <div 
          className="rich-text-editor prose prose-lg prose-blue dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Published in <strong>{post.category || 'Insights'}</strong>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
            <Share2 size={16} /> Share Article
          </button>
        </div>
      </div>
    </article>
  );
};
