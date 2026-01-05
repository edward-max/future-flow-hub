
import React, { useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, User, ArrowLeft, Share2, Eye, TrendingUp } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, settings, isLoading, incrementPostViews } = useApp();
  const hasIncremented = useRef<string | null>(null);
  
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    if (post && hasIncremented.current !== post.id) {
      document.title = `${post.title} | ${settings.site_name}`;
      // Track post view exactly once per unique post ID in this session/mount
      incrementPostViews(post.id);
      hasIncremented.current = post.id;
    }
  }, [post?.id, slug, settings.site_name, incrementPostViews]);

  if (isLoading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold">Opening Story...</p>
    </div>
  );

  if (!post) return <Navigate to="/" />;

  const isTrending = (post.views || 0) > 100;

  return (
    <article className="pb-20 animate-fade-in bg-white dark:bg-gray-900 transition-colors">
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full transition-all">
            <ArrowLeft size={16} /> Back to Home Hub
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" /> {post.created_at ? new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
            </span>
            <span className="flex items-center gap-2">
              <User size={18} className="text-blue-600" /> {post.author || 'Editorial Team'}
            </span>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="flex items-center gap-2 text-blue-600">
                <Eye size={18} /> <span className="text-gray-900 dark:text-white">{(post.views || 0).toLocaleString()}</span>
              </span>
              {isTrending && (
                <span className="flex items-center gap-1 text-[10px] text-orange-500 animate-pulse">
                  <TrendingUp size={12} /> TRENDING
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {post.cover_image && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 aspect-video">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div 
          className="rich-text-editor prose prose-xl prose-blue dark:prose-invert max-w-none font-serif leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Filed Under</span>
            <Link to={`/blog?cat=${post.category?.toLowerCase()}`} className="text-lg font-bold text-blue-600 hover:underline">
              {post.category || 'Insights'}
            </Link>
          </div>
          
          <div className="flex gap-4">
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Scroll to Top
             </button>
             <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                <Share2 size={18} /> Share Story
             </button>
          </div>
        </div>
      </div>
    </article>
  );
};
