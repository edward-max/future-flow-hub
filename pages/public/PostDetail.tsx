import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, User, Tag, Share2, MessageSquare, Send } from 'lucide-react';
import { Comment } from '../../types';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, addComment } = useApp();
  const post = posts.find(p => p.slug === slug);

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

  return (
    <article className="pb-16">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-sm mb-4 block">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8 mb-12">
        <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-xl shadow-lg" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div
          className="rich-text-editor prose prose-lg prose-blue dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags & Share */}
        <div className="border-t border-b border-gray-100 dark:border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
             <span className="text-gray-500 text-sm font-medium mr-2 self-center dark:text-gray-400">Share:</span>
             <button className="p-2 bg-blue-600 text-white rounded-full hover:opacity-90"><Share2 size={16}/></button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
           <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 dark:text-white">
             <MessageSquare className="text-[var(--primary)]"/> Comments ({post.comments?.length || 0})
           </h3>
           
           {/* Comment List */}
           <div className="space-y-6 mb-12">
             {post.comments && post.comments.length > 0 ? (
               post.comments.map(comment => (
                 <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold dark:text-gray-200">{comment.user}</h4>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                 </div>
               ))
             ) : (
               <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
             )}
           </div>

           {/* Comment Form */}
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
                     className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none dark:bg-gray-700 dark:text-white"
                     placeholder="John Doe"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
                   <textarea
                     required
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     className="w-full border dark:border-gray-600 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none dark:bg-gray-700 dark:text-white"
                     placeholder="Share your thoughts..."
                   />
                 </div>
                 <button type="submit" className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 flex items-center gap-2">
                    <Send size={18} /> Post Comment
                 </button>
              </form>
           </div>
        </div>
      </div>
    </article>
  );
};