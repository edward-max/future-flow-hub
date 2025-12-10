import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { Trash2, Edit, Plus, X, Image as ImageIcon } from 'lucide-react';

export const PostManager: React.FC = () => {
  const { posts, categories, addPost, updatePost, deletePost } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
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
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.content) return;

    // Simple slug generator
    const slug = currentPost.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const finalPost = { ...currentPost, slug } as BlogPost;

    if (posts.find(p => p.id === finalPost.id)) {
      updatePost(finalPost);
    } else {
      addPost(finalPost);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id);
    }
  };

  // Calculate SEO Score
  const getSeoScore = () => {
    let score = 0;
    if (currentPost.metaTitle && currentPost.metaTitle.length > 30) score += 40;
    if (currentPost.metaDescription && currentPost.metaDescription.length > 50) score += 40;
    if (currentPost.slug) score += 20;
    return score;
  };

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <div className="flex gap-2 mb-2">
                 <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={currentPost.imageUrl || ''}
                  onChange={e => setCurrentPost({...currentPost, imageUrl: e.target.value})}
                 />
              </div>
              {currentPost.imageUrl && <img src={currentPost.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />}
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
               <select
                 className="w-full border rounded px-3 py-2"
                 value={currentPost.category || ''}
                 onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
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

            <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-lg hover:opacity-90">
              Save Post
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
         <button onClick={handleCreate} className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
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
                 <td className="p-4 font-medium">{post.title} {post.featured && <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">Featured</span>}</td>
                 <td className="p-4 text-sm text-gray-600">{post.category}</td>
                 <td className="p-4 text-sm text-gray-600">{post.date}</td>
                 <td className="p-4 text-sm text-gray-600">{post.views}</td>
                 <td className="p-4 text-right">
                   <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit size={18} /></button>
                   <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};