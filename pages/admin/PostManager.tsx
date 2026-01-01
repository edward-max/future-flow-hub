import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { Trash2, Edit, Plus, X, Upload, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';

export const PostManager: React.FC = () => {
  const { posts, categories, addPost, updatePost, deletePost } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSavedSlug, setLastSavedSlug] = useState('');
  const [lastSavedCategory, setLastSavedCategory] = useState('');
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setShowSuccess(false);
  };

  const handleCreate = () => {
    setCurrentPost({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
      featured: false,
      content: '',
      tags: [],
      author: 'Eddy',
      comments: [],
      imageUrl: 'https://picsum.photos/800/400'
    });
    setIsEditing(true);
    setShowSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.content || !currentPost.category) return;

    // Simple slug generator
    const slug = currentPost.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const finalPost = { ...currentPost, slug } as BlogPost;

    if (posts.find(p => p.id === finalPost.id)) {
      updatePost(finalPost);
    } else {
      addPost(finalPost);
    }
    
    setLastSavedSlug(slug);
    setLastSavedCategory(currentPost.category.toLowerCase());
    setShowSuccess(true);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPost({ ...currentPost, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeoScore = () => {
    let score = 0;
    if (currentPost.metaTitle && currentPost.metaTitle.length > 30) score += 40;
    if (currentPost.metaDescription && currentPost.metaDescription.length > 50) score += 40;
    if (currentPost.slug) score += 20;
    return score;
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Post Published!</h2>
        <p className="text-gray-500 mb-10 text-center max-w-md">Your story "{currentPost.title}" is now live and ready for the world to see.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg px-6">
          {/* Updated link with category */}
          <a 
            href={`/post/${lastSavedCategory}/${lastSavedSlug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all"
          >
            <ExternalLink size={20} /> View Live Post
          </a>
          <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all"
          >
            <Plus size={20} /> Create New Post
          </button>
          <button 
            onClick={() => setShowSuccess(false)}
            className="md:col-span-2 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentPost.id && posts.find(p => p.id === currentPost.id) ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                required
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={currentPost.title || ''}
                onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
              />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
               <RichTextEditor value={currentPost.content || ''} onChange={(html) => setCurrentPost({...currentPost, content: html})} />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
               <h3 className="font-bold mb-4">SEO Settings</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Title</label>
                   <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={currentPost.metaTitle || ''}
                    onChange={e => setCurrentPost({...currentPost, metaTitle: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Description</label>
                   <textarea
                    className="w-full border rounded px-3 py-2 text-sm h-20"
                    value={currentPost.metaDescription || ''}
                    onChange={e => setCurrentPost({...currentPost, metaDescription: e.target.value})}
                   />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">SEO Score:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                       <div className={`h-full ${getSeoScore() > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${getSeoScore()}%` }}></div>
                    </div>
                    <span className="text-xs font-bold">{getSeoScore()}/100</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <input
                type="text"
                placeholder="Paste image URL..."
                className="w-full border rounded px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-[var(--primary)] outline-none bg-white"
                value={currentPost.imageUrl || ''}
                onChange={e => setCurrentPost({...currentPost, imageUrl: e.target.value})}
              />
              <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors mb-4 text-center">
                 <input
                    type="file"
                    id="post-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                 />
                 <label htmlFor="post-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-full">
                      <Upload size={20} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Click to upload image</span>
                    <span className="text-xs text-gray-400">SVG, PNG, JPG or GIF</span>
                 </label>
              </div>
              {currentPost.imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={currentPost.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setCurrentPost({...currentPost, imageUrl: ''})}
                      className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-red-50 shadow-lg"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
               <select
                 className="w-full border rounded px-3 py-2"
                 value={currentPost.category || ''}
                 onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                 required
               >
                 <option value="">Select Category</option>
                 {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
               <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={currentPost.author || ''}
                onChange={e => setCurrentPost({...currentPost, author: e.target.value})}
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
               <textarea
                className="w-full border rounded px-3 py-2 h-24"
                value={currentPost.excerpt || ''}
                onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
               />
            </div>

            <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 id="featured"
                 checked={currentPost.featured || false}
                 onChange={e => setCurrentPost({...currentPost, featured: e.target.checked})}
                 className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
               />
               <label htmlFor="featured" className="text-sm font-medium">Mark as Featured</label>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-lg hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98]">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold">Manage Posts</h1>
         <button onClick={handleCreate} className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md active:scale-95">
           <Plus size={18} /> New Post
         </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <table className="w-full text-left">
           <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
               <th className="p-4 font-medium text-gray-500 text-sm">Title</th>
               <th className="p-4 font-medium text-gray-500 text-sm">Category</th>
               <th className="p-4 font-medium text-gray-500 text-sm">Date</th>
               <th className="p-4 font-medium text-gray-500 text-sm">Views</th>
               <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
             </tr>
           </thead>
           <tbody>
             {posts.map(post => (
               <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                 <td className="p-4 font-medium">
                   <div className="flex items-center gap-2">
                     {post.title} 
                     {post.featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</span>}
                   </div>
                 </td>
                 <td className="p-4 text-sm text-gray-600">{post.category}</td>
                 <td className="p-4 text-sm text-gray-600">{post.date}</td>
                 <td className="p-4 text-sm text-gray-600">{post.views}</td>
                 <td className="p-4 text-right">
                   <div className="flex justify-end gap-2">
                     <a 
                       href={`/post/${post.category.toLowerCase()}/${post.slug}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="p-2 text-gray-400 hover:text-[var(--primary)] transition-colors"
                       title="View Live"
                     >
                       <ExternalLink size={18} />
                     </a>
                     <button onClick={() => handleEdit(post)} className="p-2 text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                       <Edit size={18} />
                     </button>
                     <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:text-red-700 transition-colors" title="Delete">
                       <Trash2 size={18} />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};