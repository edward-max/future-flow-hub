import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { uploadFile } from '../../services/supabase';
import { 
  Trash2, Edit, Plus, X, Save, Eye, Globe, Lock, 
  Image as ImageIcon, Settings, FileText, Upload, Loader2, Send, Star, AlertCircle, ShieldAlert, Sparkles, RefreshCcw, Copy, TrendingUp, ChevronRight
} from 'lucide-react';

export const PostManager: React.FC = () => {
  const { posts, categories, addPost, updatePost, deletePost, refreshData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<{ hero: boolean }>({ hero: false });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentPost({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image: '',
      category: categories[0]?.name || 'General',
      published: true,
      is_featured: false,
      author: 'Admin',
      views: 0
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading({ hero: true });
    try {
      const url = await uploadFile(file, 'blog-assets');
      setCurrentPost(prev => ({ ...prev, cover_image: url }));
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setIsUploading({ hero: false });
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaveError(null);
    if (!currentPost.title || !currentPost.content) {
      setSaveError("Please enter a title and content for your article.");
      return;
    }

    setIsSaving(true);
    try {
      const slug = currentPost.slug || generateSlug(currentPost.title!);
      const postData = {
        ...currentPost,
        slug,
        published: publish,
      };

      if (currentPost.id) {
        await updatePost(postData as BlogPost);
      } else {
        await addPost(postData as Omit<BlogPost, 'id' | 'created_at'>);
      }
      setIsEditing(false);
      refreshData();
    } catch (error: any) {
      setSaveError(error.message || JSON.stringify(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this story?")) {
      try {
        await deletePost(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in max-w-5xl mx-auto mb-20">
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {currentPost.id ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
            {currentPost.id ? 'Edit Story' : 'New Story'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-8">
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
              <ShieldAlert size={20} />
              {saveError}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headline</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-lg" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} placeholder="The Future of Flow..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL Slug</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm bg-gray-50" value={currentPost.slug || ''} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} placeholder="auto-generated-slug" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hero Image</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {currentPost.cover_image ? <img src={currentPost.cover_image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                {isUploading.hero ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload New
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Content</label>
            <RichTextEditor key={currentPost.id || 'new'} value={currentPost.content || ''} onChange={html => setCurrentPost({...currentPost, content: html})} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white font-bold" value={currentPost.category} onChange={e => setCurrentPost({...currentPost, category: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Author</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none" value={currentPost.author || ''} onChange={e => setCurrentPost({...currentPost, author: e.target.value})} />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                <input type="checkbox" checked={currentPost.is_featured} onChange={e => setCurrentPost({...currentPost, is_featured: e.target.checked})} className="w-4 h-4 rounded text-blue-600" />
                Featured Story
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex justify-end gap-4 border-t border-gray-100">
           <button onClick={() => handleSave(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-all">Save as Draft</button>
           <button onClick={() => handleSave(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
             Publish Live
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Story Manager</h1>
          <p className="text-gray-500 font-medium">Create, edit, and track the performance of your articles.</p>
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95">
          <Plus size={20} /> Compose New
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Article Details</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Popularity</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          {post.cover_image && <img src={post.cover_image} className="w-full h-full object-cover" />}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{post.title}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.author} • {new Date(post.created_at!).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">{post.category}</span>
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Eye size={10} /> {post.views || 0}</span>
                           {(post.views || 0) > 500 && <TrendingUp size={10} className="text-orange-500" />}
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min((post.views || 0) / 10, 100)}%` }}></div>
                        </div>
                     </div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {post.published ? (
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                        <Globe size={12} /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                        <Lock size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="p-20 text-center text-gray-400">
               <FileText size={64} className="mx-auto mb-4 opacity-10" />
               <p className="font-bold text-xl mb-1">No articles found.</p>
               <p className="text-sm">Start your blogging journey by clicking "Compose New".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};