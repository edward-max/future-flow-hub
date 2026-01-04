
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Facebook, Lock, Moon, Sun, CheckCircle, Instagram } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings, isAdminMode, logout, addSubscriber } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

  // Synchronize theme with HTML element for Tailwind darkMode: 'class'
  useEffect(() => {
    if (settings.theme_mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme_mode]);

  // Dynamic style for primary color and font
  const customStyle = {
    '--primary': settings.primary_color || '#3b82f6',
    fontFamily: settings.font_family === 'Inter' ? "'Inter', sans-serif" :
                settings.font_family === 'Merriweather' ? "'Merriweather', serif" :
                "'Space Grotesk', sans-serif",
  } as React.CSSProperties;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    updateSettings({
      ...settings,
      theme_mode: settings.theme_mode === 'light' ? 'dark' : 'light'
    });
  };

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

  return (
    <div 
      style={customStyle} 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${settings.theme_mode === 'dark' ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} ${settings.layout_mode === 'boxed' ? 'max-w-7xl mx-auto shadow-2xl my-4' : ''}`}
    >
      {/* Top Bar */}
      <div className="bg-gray-900 dark:bg-black text-white text-xs py-2 px-4 flex justify-between items-center transition-colors duration-300">
        <p>{settings.tagline || 'Welcome'}</p>
        <div className="flex gap-4 items-center">
          {isAdminMode && (
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 transition-colors">
              <Lock size={12} /> Exit Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[var(--primary)]">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-12 w-auto object-contain" />
            ) : (
              settings.site_name || 'Future Flow Hub'
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center font-medium">
            <NavLink to="/" className={({isActive}) => isActive ? "text-[var(--primary)]" : "hover:text-[var(--primary)] text-gray-700 dark:text-gray-300 dark:hover:text-[var(--primary)]"}>Home</NavLink>
            <NavLink to="/blog" className={({isActive}) => isActive ? "text-[var(--primary)]" : "hover:text-[var(--primary)] text-gray-700 dark:text-gray-300 dark:hover:text-[var(--primary)]"}>Blog</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? "text-[var(--primary)]" : "hover:text-[var(--primary)] text-gray-700 dark:text-gray-300 dark:hover:text-[var(--primary)]"}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? "text-[var(--primary)]" : "hover:text-[var(--primary)] text-gray-700 dark:text-gray-300 dark:hover:text-[var(--primary)]"}>Contact</NavLink>
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300" aria-label="Toggle Theme">
              {settings.theme_mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link to="/contact#newsletter" className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm hover:opacity-90 transition-opacity">
              Subscribe
            </Link>
          </nav>

          {/* Mobile Toggle & Theme */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">
                {settings.theme_mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 dark:text-white">
              {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 flex flex-col gap-4 transition-colors duration-300">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200">Home</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200">Blog</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200">About</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200">Contact</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              {settings.logo_url ? (
                 <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto object-contain" />
              ) : (
                <h3 className="text-white text-xl font-bold">{settings.site_name || 'Future Flow Hub'}</h3>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-4">{settings.description}</p>
            <div className="flex gap-4">
               {settings.social_links?.facebook && <a href={settings.social_links.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Facebook size={20} /></a>}
               {settings.social_links?.instagram && <a href={settings.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Instagram size={20} /></a>}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog?cat=tech" className="hover:text-[var(--primary)]">Tech Trends</Link></li>
              <li><Link to="/blog?cat=ai" className="hover:text-[var(--primary)]">AI Innovations</Link></li>
              <li><Link to="/blog?cat=startups" className="hover:text-[var(--primary)]">Startups</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[var(--primary)]">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--primary)]">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--primary)]">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Newsletter</h4>
             <p className="text-sm mb-2">Get the latest insights delivered to your inbox.</p>
             {subStatus.type === 'success' ? (
                <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> {subStatus.msg}
                </div>
             ) : (
               <form className="flex gap-2 flex-col" onSubmit={handleSubscribe}>
                 <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="bg-gray-800 border-none rounded px-3 py-2 w-full text-sm text-white focus:ring-1 focus:ring-[var(--primary)]" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="bg-[var(--primary)] text-white px-3 py-2 rounded hover:opacity-90">Go</button>
                 </div>
                 {subStatus.type === 'error' && <span className="text-red-400 text-xs">{subStatus.msg}</span>}
               </form>
             )}
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm flex flex-col items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} {settings.site_name || 'Future Flow Hub'}. All rights reserved.</span>
          <Link to="/secure-admin-entry" className="opacity-20 hover:opacity-100 transition-opacity text-xs">Admin</Link>
        </div>
      </footer>
    </div>
  );
};
