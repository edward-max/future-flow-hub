
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, User, ArrowLeft, Share2, Eye, TrendingUp, CheckCircle, Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, settings, isLoading, incrementPostViews } = useApp();
  const [copied, setCopied] = useState(false);
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

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const socialShares = [
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2]'
    },
    {
      name: 'X',
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-[#000000]'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#0A66C2]'
    }
  ];

  if (isLoading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold font-mono tracking-widest text-xs uppercase">Opening Story...</p>
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
            
            {/* ENHANCED VIEW BADGE - Keeping it highly visible as requested */}
            <div className="flex items-center gap-3 bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-blue-600/30">
              <Eye size={20} className="animate-pulse" /> 
              <span className="font-black text-lg tracking-tighter">
                {(post.views || 0).toLocaleString()} <span className="text-[10px] opacity-70 ml-1">VIEWS</span>
              </span>
              {isTrending && (
                <div className="h-4 w-[1px] bg-white/30 mx-1"></div>
              )}
              {isTrending && (
                <span className="flex items-center gap-1 text-[10px] font-black tracking-widest">
                  <TrendingUp size={12} /> TRENDING
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {post.cover_image && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 aspect-video group">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        <div 
          className="rich-text-editor prose prose-xl prose-blue dark:prose-invert max-w-none font-serif leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Filed Under</span>
            <Link to={`/blog?cat=${post.category?.toLowerCase()}`} className="text-lg font-bold text-blue-600 hover:underline">
              {post.category || 'Insights'}
            </Link>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spread the Knowledge</span>
            <div className="flex flex-wrap gap-2 relative">
              {copied && (
                <div className="absolute -top-12 right-0 bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 animate-bounce shadow-lg whitespace-nowrap z-20">
                  <CheckCircle size={14} /> LINK COPIED TO CLIPBOARD!
                </div>
              )}
              
              {socialShares.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} text-white p-3 rounded-xl hover:scale-110 transition-transform shadow-lg shadow-black/10`}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
              
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 group"
              >
                <LinkIcon size={18} className="group-hover:rotate-12 transition-transform" /> 
                Copy Link
              </button>

              <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                className="hidden md:flex items-center px-5 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
              >
                Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
