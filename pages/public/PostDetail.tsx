import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, User, Tag, MessageSquare, Send, Check, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Comment } from '../../types';

export const PostDetail: React.FC = () => {
  // Extract category and slug from URL
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const { posts, settings, addComment } = useApp();
  
  // Find post matching both slug and category (case insensitive for category)
  const post = posts.find(p => p.slug === slug && p.category.toLowerCase() === category?.toLowerCase());

  // Sharing state
  const [copied, setCopied] = useState(false);

  // Dynamic SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.metaTitle || post.title} | ${settings.siteName}`;
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) metaDesc.setAttribute('content', post.metaDescription || post.excerpt);
    }
    
    // Cleanup to revert to default on unmount
    return () => {
      document.title = `${settings.siteName} | ${settings.tagline}`;
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) metaDesc.setAttribute('content', settings.description);
    };
  }, [post, settings]);

  // Comment State
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  if (!post) {
    return <Navigate to="/blog" />;
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      user: commentName,
      text: commentText,
      date: new Date().toLocaleDateString()
    };

    addComment(post.id, newComment);
    setCommentName('');
    setCommentText('');
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  };

  const openPopup = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,location=0,menubar=0,toolbar=0');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <article className="pb-16 animate-fade-in">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-sm mb-4 block">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2 font-medium"><div className="w-8 h-8 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center text-xs">{post.author.charAt(0)}</div> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8 mb-12">
        <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-xl shadow-lg border border-white dark:border-gray-700" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div
          className="rich-text-editor prose prose-lg prose-blue dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags & Share */}
        <div className="border-t border-b border-gray-100 dark:border-gray-800 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-transparent hover:border-[var(--primary)] cursor-default transition-colors">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
             <span className="text-gray-500 text-xs font-bold uppercase tracking-widest dark:text-gray-400">Share this insight</span>
             <div className="flex gap-3 relative">
                <button 
                  onClick={() => openPopup(shareUrls.facebook)}
                  className="p-3 bg-[#1877F2] text-white rounded-full hover:scale-110 hover:shadow-lg transition-all active:scale-95 shadow-md"
                  title="Share on Facebook"
                >
                  <Facebook size={18} fill="currentColor" />
                </button>

                <button 
                  onClick={() => openPopup(shareUrls.twitter)}
                  className="p-3 bg-black text-white rounded-full hover:scale-110 hover:shadow-lg transition-all active:scale-95 shadow-md border border-gray-800"
                  title="Share on X"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>

                <button 
                  onClick={() => openPopup(shareUrls.linkedin)}
                  className="p-3 bg-[#0077b5] text-white rounded-full hover:scale-110 hover:shadow-lg transition-all active:scale-95 shadow-md"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} fill="currentColor" />
                </button>

                <button 
                  onClick={copyToClipboard}
                  className={`p-3 ${copied ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} rounded-full hover:scale-110 hover:shadow-lg transition-all active:scale-95 shadow-md`}
                  title="Copy Link"
                >
                  {copied ? <Check size={18} /> : <LinkIcon size={18}/>}
                </button>

                {copied && (
                  <div className="absolute -top-12 right-0 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-1 whitespace-nowrap z-20 font-bold">
                    <Check size={10} /> Copied!
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
           <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 dark:text-white">
             <MessageSquare className="text-[var(--primary)]"/> Comments ({post.comments?.length || 0})
           </h3>
           
           <div className="space-y-6 mb-12">
             {post.comments && post.comments.length > 0 ? (
               post.comments.map(comment => (
                 <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:translate-x-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold dark:text-gray-200 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-[10px]">{comment.user.charAt(0)}</div>
                        {comment.user}
                      </h4>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 ml-8">{comment.text}</p>
                 </div>
               ))
             ) : (
               <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                 <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
               </div>
             )}
           </div>

           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h4 className="text-lg font-bold mb-4 dark:text-white">Leave a Reply</h4>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                   <input
                     required
                     type="text"
                     value={commentName}
                     onChange={(e) => setCommentName(e.target.value)}
                     className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none dark:bg-gray-700 dark:text-white transition-all"
                     placeholder="John Doe"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
                   <textarea
                     required
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none dark:bg-gray-700 dark:text-white transition-all"
                     placeholder="Share your thoughts..."
                   />
                 </div>
                 <button type="submit" className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20 transition-all active:scale-95">
                    <Send size={18} /> Post Comment
                 </button>
              </form>
           </div>
        </div>
      </div>
    </article>
  );
};