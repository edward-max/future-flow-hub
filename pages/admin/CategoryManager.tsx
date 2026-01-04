
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Trash2, Edit, Plus, X, Save, Grid, Tag, AlertCircle, Database, Copy, Check, CloudCheck } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, dbStatus, refreshData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Re-check DB status when component mounts to ensure we detect the new table
  useEffect(() => {
    refreshData();
  }, []);

  const sqlCode = `-- Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view categories
CREATE POLICY "Allow public read-only access" ON public.categories
    FOR SELECT USING (true);

-- Allow authenticated users to perform all actions
CREATE POLICY "Allow authenticated full access" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');`;

  const handleEdit = (cat: Category) => {
    setCurrentCat(cat);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentCat({ name: '', slug: '' });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCat.name?.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    
    const slug = currentCat.slug?.trim() || 
                 currentCat.name.toLowerCase().trim()
                   .replace(/\s+/g, '-')
                   .replace(/[^\w-]+/g, '')
                   .replace(/--+/g, '-');
    
    let result;
    if (currentCat.id) {
      result = await updateCategory({ ...currentCat, slug } as Category);
    } else {
      result = await addCategory({ name: currentCat.name.trim(), slug });
    }

    setIsSaving(false);
    
    if (result.success) {
      setIsModalOpen(false);
      if (result.fallback) {
        console.warn("Table found but save failed - check RLS policies.");
      }
    } else {
      setErrorMsg(`Error: ${result.error?.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? Posts using this category may become uncategorized.")) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Content Categories
            {dbStatus.categories ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1 font-bold">
                <Database size={10} /> Database Connected
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1 font-bold animate-pulse">
                <AlertCircle size={10} /> Local Storage Mode
              </span>
            )}
          </h1>
          <p className="text-gray-500">Organize your articles into topics.</p>
        </div>
        <button 
          onClick={handleCreate} 
          className="bg-blue-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all font-bold active:scale-95"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* SQL Setup Helper Card (Only shows if table is missing or errored) */}
      {!dbStatus.categories && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Database size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-800 font-black uppercase tracking-widest text-xs mb-4">
              <Database size={16} /> Supabase Database Setup Required
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">The 'categories' table was not found</h3>
            <p className="text-amber-800/80 mb-6 max-w-2xl text-sm leading-relaxed">
              If you just created the table, try <strong>refreshing the page</strong>. Otherwise, copy the code below and run it in your Supabase SQL Editor.
            </p>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-[10px] font-mono text-gray-400">CREATE_CATEGORIES.SQL</span>
                <button 
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'COPIED' : 'COPY SQL'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-blue-200 leading-relaxed whitespace-pre">
                {sqlCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category Name</th>
              <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">URL Slug</th>
              <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                      <Tag size={16} />
                    </div>
                    <span className="font-bold text-gray-800">{cat.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm text-gray-500">
                  {cat.slug}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(cat)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Grid size={48} className="mx-auto mb-4 opacity-20" />
            <p>No categories defined yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl">{currentCat.id ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}
              {dbStatus.categories ? (
                 <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-[11px] rounded-lg flex items-center gap-2">
                    <Database size={12} /> Cloud storage active. Data will be saved permanently.
                 </div>
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] rounded-lg">
                  <strong>Notice:</strong> Database table not found. Saving to browser LocalStorage until setup is complete.
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                <input 
                  required
                  autoFocus
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  value={currentCat.name || ''}
                  onChange={e => setCurrentCat({...currentCat, name: e.target.value})}
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug (Optional)</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-900 transition-all font-mono text-sm bg-gray-50"
                  value={currentCat.slug || ''}
                  onChange={e => setCurrentCat({...currentCat, slug: e.target.value})}
                  placeholder="auto-generated-if-empty"
                />
              </div>
              <button 
                disabled={isSaving}
                className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving to Cloud...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Category
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
