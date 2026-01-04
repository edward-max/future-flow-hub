
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Eye, CheckCircle, Loader2, Calendar, User as UserIcon, FileWarning } from 'lucide-react';
import { HeroBackground } from '../../components/HeroBackground';

export const Home: React.FC = () => {
  const { posts, settings, addSubscriber, isLoading, isAdminMode } = useApp();
  
  // Filter only published posts for the public home page
  const publishedPosts = posts.filter(p => p.published);
  
  // Priority: 1. Featured property, 2. Most recent post
  const featuredPost = publishedPosts.find(p => p.is_featured) || publishedPosts[0];
  
  // All other posts excluding the featured one
  const otherPosts = publishedPosts.filter(p => p.id !== featuredPost?.id);
  
  // Trending posts based on views
  const trendingPosts = [...publishedPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  // SEO
  useEffect(() => {
    document.title = `${settings.site_name} | ${settings.tagline}`;
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.setAttribute('content', settings.description);
  }, [settings]);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const result = await addSubscriber(email);
    setSubStatus({
      type: result.success ? 'success' : 'error',
      msg: result.message
    });
    if (result.success) setEmail('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gray-900 dark:bg-black pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-900 dark:from-black/40 dark:via-black/80 dark:to-black"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-16">
             <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
               Exploring New Frontiers
             </span>
             <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white tracking-tight">
               {settings.tagline}
             </h1>
             <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
               {settings.description}
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <Link to="/blog" className="px-10 py-4 bg-[var(--primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-2xl shadow-[var(--primary)]/40 transform hover:-translate-y-1">
                 Explore Articles
               </Link>
               <Link to="/contact" className="px-10 py-4 bg-white/5 text-white backdrop-blur-md border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all transform hover:-translate-y-1">
                 Join Community
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        {publishedPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center shadow-2xl border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileWarning size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4 dark:text-white">No Articles Published Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              We're currently preparing some amazing content. {isAdminMode ? "Since you're the admin, please go to the Post Manager and ensure your posts are marked as 'Published'." : "Please check back soon!"}
            </p>
            {isAdminMode && (
              <Link to="/admin/posts" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all">
                Go to Post Manager <ArrowRight size={18} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Main Feed */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Featured Post Hero Card */}
              {featuredPost && (
                <section className="animate-fade-in">
                  <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                    <div className="aspect-[21/9] w-full overflow-hidden">
                      <img
                        src={featuredPost.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>
                    
                    <div className="p-8 md:p-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Featured Story
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                          {featuredPost.category}
                        </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-5xl font-black mb-6 dark:text-white leading-tight hover:text-[var(--primary)] transition-colors">
                        <Link to={`/post/${featuredPost.category?.toLowerCase() || 'general'}/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 line-clamp-2 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center font-black text-[var(--primary)] text-lg border border-blue-100 dark:border-gray-600">
                            {(featuredPost.author || 'E').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold dark:text-white">{featuredPost.author || 'Editorial Team'}</p>
                            <p className="text-xs text-gray-400 font-medium">Article Author</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                          <span className="flex items-center gap-2"><Calendar size={18} className="text-[var(--primary)]" /> {featuredPost.created_at ? new Date(featuredPost.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                          <span className="flex items-center gap-2"><Eye size={18} className="text-[var(--primary)]" /> {featuredPost.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Latest Articles Grid */}
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    Latest Insights
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded font-bold">{otherPosts.length}</span>
                  </h3>
                  <Link to="/blog" className="text-sm font-bold text-[var(--primary)] flex items-center gap-2 hover:underline group">
                    View Full Archive <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {otherPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {otherPosts.map(post => (
                      <article key={post.id} className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={post.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4">
                             <span className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg dark:text-white shadow-sm border border-gray-100 dark:border-gray-800">
                               {post.category || 'General'}
                             </span>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                          <h4 className="text-xl font-black mb-4 group-hover:text-[var(--primary)] dark:text-white transition-colors leading-tight">
                            <Link to={`/post/${post.category?.toLowerCase() || 'general'}/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span className="flex items-center gap-2"><Clock size={14} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
                            <span className="flex items-center gap-2 text-[var(--primary)] hover:underline cursor-pointer">Read Full Story <ArrowRight size={12} /></span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 font-bold">New articles are currently being prepared. Check back soon!</p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              
              {/* Trending Sidebar Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-black mb-8 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-[var(--primary)] rounded-full"></span>
                  Trending Now
                </h3>
                <div className="space-y-8">
                  {trendingPosts.map((post, idx) => (
                    <div key={post.id} className="flex gap-5 items-start group">
                      <span className="text-4xl font-black text-gray-200 dark:text-gray-700 group-hover:text-[var(--primary)] transition-colors leading-none">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">
                          {post.category || 'General'}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[var(--primary)] transition-colors">
                          <Link to={`/post/${post.category?.toLowerCase() || 'general'}/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                           <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Newsletter Box */}
              <div className="bg-[var(--primary)] rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-12 -translate-y-12 blur-2xl"></div>
                
                <h3 className="text-3xl font-black mb-4 relative z-10 leading-tight">The Future Inbox</h3>
                <p className="mb-8 opacity-90 relative z-10 font-medium text-sm leading-relaxed">
                  Join 10k+ innovators receiving our curated weekly deep-dives into AI, Tech, and the Future.
                </p>
                
                {subStatus.type === 'success' ? (
                  <div className="bg-white/20 border border-white/30 p-8 rounded-2xl text-center relative z-10 animate-fade-in">
                    <CheckCircle size={56} className="mx-auto mb-4 text-white" />
                    <h4 className="text-2xl font-black mb-2">You're In!</h4>
                    <p className="opacity-90 text-sm font-bold">{subStatus.msg}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4 relative z-10">
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl text-gray-900 border-none focus:ring-4 focus:ring-white/20 shadow-xl font-bold placeholder:text-gray-400" 
                      />
                    </div>
                    {subStatus.type === 'error' && <p className="text-red-200 text-xs font-black bg-red-900/30 p-3 rounded-lg border border-red-400/20">{subStatus.msg}</p>}
                    <button type="submit" className="w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                      Subscribe Now <ArrowRight size={20} />
                    </button>
                  </form>
                )}
                <p className="mt-6 text-[10px] text-center opacity-60 font-bold uppercase tracking-widest">No Spam. Just Quality Content.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
