import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Eye, CheckCircle } from 'lucide-react';
import { HeroBackground } from '../../components/HeroBackground';

export const Home: React.FC = () => {
  const { posts, settings, addSubscriber } = useApp();
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const recentPosts = posts.filter(p => p.id !== featuredPost?.id).slice(0, 3);
  const trendingPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);

  // SEO
  useEffect(() => {
    document.title = `${settings.siteName} | ${settings.tagline}`;
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.setAttribute('content', settings.description);
  }, [settings]);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const result = addSubscriber(email);
    setSubStatus({
      type: result.success ? 'success' : 'error',
      msg: result.message
    });
    if (result.success) setEmail('');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 dark:bg-black py-24 md:py-32 overflow-hidden transition-colors duration-300">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <HeroBackground />
          {/* Vignette Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50 dark:from-black dark:to-black/50 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/80 dark:from-black/80 dark:to-black/80 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
           <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 backdrop-blur-sm border border-blue-500/30 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
             Welcome to the Future
           </span>
           <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-sm">
             {settings.tagline}
           </h1>
           <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
             {settings.description}
           </p>
           <div className="flex justify-center gap-4">
             <Link to="/blog" className="px-8 py-4 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-[var(--primary)]/50 transform hover:-translate-y-1">
               Read Blog
             </Link>
             <Link to="/about" className="px-8 py-4 bg-white/10 text-white backdrop-blur border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-all transform hover:-translate-y-1">
               Our Mission
             </Link>
           </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16 container mx-auto px-4 -mt-10 relative z-20">
           <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden group transition-colors duration-300">
              <div className="h-64 md:h-96 overflow-hidden relative">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                   Featured Story
                </div>
              </div>
              <div className="p-8">
                 <span className="text-[var(--primary)] font-bold text-sm uppercase tracking-wider">{featuredPost.category}</span>
                 <h3 className="text-3xl font-bold mt-2 mb-4 group-hover:text-[var(--primary)] transition-colors dark:text-white leading-tight">
                   <Link to={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link>
                 </h3>
                 <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                 <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                   <span className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200"><div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-[10px]">{featuredPost.author.charAt(0)}</div> {featuredPost.author}</span>
                   <span>•</span>
                   <span>{featuredPost.date}</span>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Recent Posts Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold dark:text-white">Latest Insights</h2>
            <Link to="/blog" className="text-[var(--primary)] flex items-center gap-1 hover:underline">View All <ArrowRight size={16} /></Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700 group">
                <div className="h-48 overflow-hidden relative">
                   <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <span className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 text-xs font-bold rounded dark:text-white shadow-sm">{post.category}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                   <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] dark:text-white transition-colors">
                     <Link to={`/post/${post.slug}`}>{post.title}</Link>
                   </h3>
                   <h2 className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt}</h2>
                   <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                     <div className="flex items-center gap-1"><Clock size={14} /> {post.date}</div>
                     <div className="flex items-center gap-1"><Eye size={14} /> {post.views}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Minimal List */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Trending Now</h2>
        <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-8">
              {trendingPosts.map((post, idx) => (
                <div key={post.id} className="flex gap-4 items-start group">
                   <span className="text-3xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-[var(--primary)] transition-colors">0{idx + 1}</span>
                   <div>
                     <span className="text-xs font-semibold text-[var(--primary)] uppercase">{post.category}</span>
                     <h4 className="text-lg font-bold leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-400 dark:text-gray-100 transition-colors">
                       <Link to={`/post/${post.slug}`}>{post.title}</Link>
                     </h4>
                   </div>
                </div>
              ))}
           </div>
           
           {/* Newsletter Mini */}
           <div className="bg-[var(--primary)] rounded-2xl p-8 text-white flex flex-col justify-center shadow-lg relative overflow-hidden">
             {/* Decorative circle */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
             
             <h3 className="text-2xl font-bold mb-4 relative z-10">Stay Ahead of the Curve</h3>
             <p className="mb-6 opacity-90 relative z-10">Join 10,000+ subscribers getting the future delivered to their inbox weekly.</p>
             
             {subStatus.type === 'success' ? (
                <div className="bg-white/10 border border-white/20 p-6 rounded-xl text-center relative z-10">
                  <CheckCircle size={48} className="mx-auto mb-2 text-white" />
                  <h4 className="text-xl font-bold mb-1">Subscribed!</h4>
                  <p className="opacity-80 text-sm">{subStatus.msg}</p>
                  <button 
                    onClick={() => setSubStatus({type: 'idle', msg: ''})}
                    className="mt-4 text-xs underline opacity-70 hover:opacity-100"
                  >
                    Register another email
                  </button>
                </div>
             ) : (
               <form onSubmit={handleSubscribe} className="space-y-3 relative z-10">
                 <input 
                   type="email" 
                   required
                   placeholder="Email address" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-4 py-3 rounded-lg text-gray-900 border-none focus:ring-2 focus:ring-white/50" 
                 />
                 {subStatus.type === 'error' && <p className="text-red-200 text-sm font-bold bg-red-900/20 p-2 rounded">{subStatus.msg}</p>}
                 <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">Subscribe Free</button>
               </form>
             )}
           </div>
        </div>
      </section>
    </div>
  );
};