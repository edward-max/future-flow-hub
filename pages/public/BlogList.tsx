import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { posts, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('cat');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory ? post.category.toLowerCase() === activeCategory.toLowerCase() : true;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Our Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore articles on technology, investment, and growth.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
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
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!activeCategory ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          All
        </button>
        {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setSearchParams({ cat: cat.slug })}
             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.slug ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
           >
             {cat.name}
           </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/post/${post.slug}`} className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col hover:shadow-md transition-all">
                <div className="h-56 overflow-hidden">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">{post.category}</span>
                     <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] dark:text-white transition-colors">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500 dark:text-gray-400">
          <p className="text-xl">No posts found matching your criteria.</p>
          <button onClick={() => {setSearchParams({}); setSearchTerm('')}} className="mt-4 text-[var(--primary)] underline">Clear Filters</button>
        </div>
      )}
    </div>
  );
};