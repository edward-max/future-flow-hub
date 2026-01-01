import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { posts, categories, settings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('cat');

  // Dynamic SEO
  useEffect(() => {
    if (activeCategory) {
      const catName = categories.find(c => c.slug === activeCategory)?.name || activeCategory;
      document.title = `${catName} Articles | ${settings.siteName}`;
    } else {
      document.title = `Blog | ${settings.siteName}`;
    }
  }, [activeCategory, categories, settings]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory ? post.category.toLowerCase() === activeCategory.toLowerCase() : true;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Our Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore articles on technology, investment, and growth.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full w-full md:w-64 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          All Topics
        </button>
        {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setSearchParams({ cat: cat.slug })}
             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.slug ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
           >
             {cat.name}
           </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/post/${post.slug}`} className="group block h-full">
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="h-56 overflow-hidden relative">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">{post.category}</span>
                     <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] dark:text-white transition-colors leading-snug">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">{post.author}</span>
                    <span className="text-xs text-gray-400">{post.views} views</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500 dark:text-gray-400">
          <div className="mb-4 flex justify-center text-gray-300">
            <Search size={48} />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">No posts found.</p>
          <p className="mt-2">Try adjusting your search or filters.</p>
          <button onClick={() => {setSearchParams({}); setSearchTerm('')}} className="mt-6 text-[var(--primary)] font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
};