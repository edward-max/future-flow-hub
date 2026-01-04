
import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { uploadFile } from '../../services/supabase';
import { 
  Trash2, Edit, Plus, X, Save, Eye, Globe, Lock, 
  Image as ImageIcon, Settings, FileText, Upload, Loader2, Send, Star, AlertCircle, ShieldAlert, Sparkles, RefreshCcw, Copy
} from 'lucide-react';

export const PostManager: React.FC = () => {
  const { posts, categories, addPost, updatePost, deletePost, refreshData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ultimateFixSql = `-- ULTIMATE DATABASE REPAIR & SYNC

-- 1. Create Settings Table if not exists
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_name TEXT DEFAULT 'Future Flow Hub',
    tagline TEXT DEFAULT 'Your Daily Dose of Tech',
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#3b82f6',
    font_family TEXT DEFAULT 'Inter',
    layout_mode TEXT DEFAULT 'wide',
    theme_mode TEXT DEFAULT 'light',
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Ensure all Post columns exist
ALTER TABLE IF EXISTS public.posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin';
ALTER TABLE IF EXISTS public.posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS public.posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE IF EXISTS public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT DEFAULT '';

-- 3. RESET POLICIES
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read" ON public.posts;
CREATE POLICY "Allow Public Read" ON public.posts FOR SELECT TO public USING (published = true);
DROP POLICY IF EXISTS "Allow Admin All" ON public.posts;
CREATE POLICY "Allow Admin All" ON public.posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Public Read Settings" ON public.settings;
CREATE POLICY "Allow Public Read Settings" ON public.settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow Admin All Settings" ON public.settings;
CREATE POLICY "Allow Admin All Settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. FORCE SCHEMA CACHE RELOAD
NOTIFY pgrst, 'reload schema';`;

  const handleCopy = () => {
    navigator.clipboard.writeText(ultimateFixSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadFile(file, 'blog-assets');
      setCurrentPost(prev => ({ ...prev, cover_image: url }));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
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
      const slug = currentPost.slug || generateSlug(currentPost.title);
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
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <ShieldAlert className="text-red-600 shrink-0 mt-1" size={24} />
                <div className="flex-grow">
                  <h3 className="font-bold text-red-900 mb-1">Database Sync Error</h3>
                  <p className="text-sm text-red-800 mb-4">{saveError}</p>
                  <div className="bg-white/60 rounded-xl p-5 border border-red-100">
                    <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2"><Sparkles size={14} className="text-blue-600" /> How to Fix: Run the script below in your Supabase SQL Editor</p>
                    <div className="relative group">
                       <pre className="bg-gray-900 text-blue-100 p-4 rounded-lg text-[10px] font-mono overflow-x-auto whitespace-pre">{ultimateFixSql}</pre>
                       <button onClick={handleCopy} className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-[10px] font-black shadow-lg flex items-center gap-1.5">
                        {copied ? <RefreshCcw size={12} className="animate-spin" /> : <Copy size={12} />}
                        {copied ? 'COPIED!' : 'COPY SYNC SQL'}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Headline</label>
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-lg" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} placeholder="The Future of Flow..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">URL Identifier (Slug)</label>
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm bg-gray-50" value={currentPost.slug || ''} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} placeholder="auto-generated-slug" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Article Body</label>
            <RichTextEditor key={currentPost.id || 'new'} value={currentPost.content || ''} onChange={html => setCurrentPost({...currentPost, content: html})} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white" value={currentPost.category} onChange={e => setCurrentPost({...currentPost, category: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-black uppercase tracking-widest text-gray-400">Hero Image URL</label>
               <div className="flex gap-2">
                  <input className="flex-grow border border-gray-300 rounded-xl px-4 py-3 text-sm" value={currentPost.cover_image || ''} onChange={e => setCurrentPost({...currentPost, cover_image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 px-4 rounded-xl transition-colors">{isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                <input type="checkbox" checked={currentPost.is_featured || false} onChange={e => setCurrentPost({...currentPost, is_featured: e.target.checked})} className="w-5 h-5 accent-blue-600 rounded-lg" />
                Feature in Hero
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                <input type="checkbox" checked={currentPost.published || false} onChange={e => setCurrentPost({...currentPost, published: e.target.checked})} className="w-5 h-5 accent-green-600 rounded-lg" />
                Published
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleSave(false)} disabled={isSaving} className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">Save as Draft</button>
              <button onClick={() => handleSave(true)} disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                Publish Live
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Stories</h1>
          <p className="text-gray-500">Draft and publish your best work.</p>
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95">
          <Plus size={24} /> New Story
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Story Title</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-lg leading-tight">{post.title}</span>
                    {post.is_featured && <Star size={16} fill="#eab308" className="text-yellow-500" />}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">/{post.slug}</div>
                </td>
                <td className="p-6 text-center">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${post.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(post)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={20} /></button>
                    <button onClick={() => deletePost(post.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="p-20 text-center bg-gray-50/30">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><FileText size={32} /></div>
            <h3 className="font-bold text-gray-800">No stories found</h3>
            <p className="text-gray-500 text-sm mt-1">Start building your publication today.</p>
          </div>
        )}
      </div>
    </div>
  );
};
