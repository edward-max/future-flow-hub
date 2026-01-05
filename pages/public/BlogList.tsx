
import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Loader2, Eye, TrendingUp } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { posts, categories, settings, isLoading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('cat');

  // Dynamic SEO
  useEffect(() => {
    if (activeCategory) {
      const catName = categories.find(c => c.slug === activeCategory)?.name || activeCategory;
      document.title = `${catName} Articles | ${settings.site_name}`;
    } else {
      document.title = `Blog | ${settings.site_name}`;
    }
  }, [activeCategory, categories, settings]);

  const filteredPosts = useMemo(() => {
    // PUBLIC view: Always filter for published posts first
    const publishedOnly = posts.filter(p => p.published);
    
    return publishedOnly.filter(post => {
      // Use optional chaining to prevent crashes if category is null
      const matchesCategory = activeCategory 
        ? post.category?.toLowerCase() === activeCategory.toLowerCase() 
        : true;
      
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 dark:text-white tracking-tight">Public Archive</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover all published stories and insights.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl w-full md:w-80 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 pb-6 mb-10 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
        <button
          onClick={() => setSearchParams({})}
          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${!activeCategory ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          All Topics
        </button>
        {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setSearchParams({ cat: cat.slug })}
             className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat.slug ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
           >
             {cat.name}
           </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/post/${post.category?.toLowerCase() || 'general'}/${post.slug}`} className="group block h-full">
              <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
                
                {/* View Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/20">
                  <Eye size={12} className="text-blue-400" />
                  {(post.views || 0).toLocaleString()}
                  {(post.views || 0) > 100 && <TrendingUp size={10} className="text-orange-400" />}
                </div>

                <div className="h-64 overflow-hidden relative">
                  <img src={post.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{post.category || 'General'}</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-4 group-hover:text-blue-600 dark:text-white transition-colors leading-tight">{post.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                  
                  <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600">
                          {(post.author || 'A').charAt(0)}
                       </div>
                       <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{post.author || 'Staff'}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-1 transition-transform">View Story &rarr;</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="mb-4 flex justify-center text-gray-300">
            <Search size={64} />
          </div>
          <p className="text-2xl font-black text-gray-800 dark:text-white">No articles matching your filters.</p>
          <p className="mt-2 font-medium">Try searching for something else or browse all topics.</p>
          <button onClick={() => {setSearchParams({}); setSearchTerm('')}} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Reset Filters</button>
        </div>
      )}
    </div>
  );
};
