
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Palette, Type, Layout as LayoutIcon, Globe, Image as ImageIcon, 
  Cloud, Save, RefreshCcw, Check, ArrowRight, ShieldCheck, 
  Monitor, Smartphone, Maximize, Minimize, Facebook, Instagram,
  ShieldAlert, Sparkles, Copy, Database, RefreshCw
} from 'lucide-react';
import { uploadFile } from '../../services/supabase';

export const Settings: React.FC = () => {
  const { settings, updateSettings, isSavingSettings, dbStatus, refreshData } = useApp();
  const [isUploading, setIsUploading] = useState<{ logo: boolean; favicon: boolean }>({ logo: false, favicon: false });
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ ...settings, [key]: value });
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const settingsFixSql = `-- CREATE SETTINGS TABLE & CONFIGURE PERMISSIONS
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

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow Public Read Settings" ON public.settings;
CREATE POLICY "Allow Public Read Settings" ON public.settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow Admin All Settings" ON public.settings;
CREATE POLICY "Allow Admin All Settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Force cache reload
NOTIFY pgrst, 'reload schema';`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(settingsFixSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    try {
      const url = await uploadFile(file, 'blog-assets');
      handleChange(type === 'logo' ? 'logo_url' : 'favicon_url', url);
    } catch (err) {
      console.error("Upload error:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(type === 'logo' ? 'logo_url' : 'favicon_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const SectionHeader = ({ icon, title, desc }: any) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 pl-12">{desc}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      {/* Header with Save Status */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Appearance & SEO</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure your brand identity and visual language.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleManualRefresh}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-400'}`}
            title="Refresh database connection"
          >
            <RefreshCw size={18} />
          </button>
          
          {isSavingSettings ? (
            <span className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 animate-pulse">
              <RefreshCcw size={14} className="animate-spin" /> Syncing...
            </span>
          ) : dbStatus.settings ? (
            <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <Cloud size={14} /> Cloud Active
            </span>
          ) : (
            <button 
              onClick={handleManualRefresh}
              className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 hover:bg-amber-100 transition-all"
            >
              <Database size={14} /> Local Cache Only (Retry?)
            </button>
          )}
        </div>
      </div>

      {/* SQL Error Fix Section */}
      {!dbStatus.settings && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-12 animate-fade-in">
           <div className="flex items-start gap-5">
             <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
               <ShieldAlert size={32} />
             </div>
             <div className="flex-grow">
               <h3 className="text-xl font-black text-amber-900 mb-2">Database Sync Required</h3>
               <p className="text-amber-800 text-sm mb-6 max-w-2xl leading-relaxed font-medium">
                 The site configuration table is missing or the API cache is stale. If you've already run the SQL script, click <strong>"RETRY CONNECTION"</strong> below. 
               </p>
               
               <div className="flex gap-4 mb-6">
                 <button 
                   onClick={handleManualRefresh}
                   disabled={isRefreshing}
                   className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                 >
                   {isRefreshing ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                   RETRY CONNECTION
                 </button>
                 <button 
                   onClick={handleCopySql}
                   className="bg-white text-amber-700 border border-amber-200 px-6 py-3 rounded-xl font-bold hover:bg-amber-100 transition-all flex items-center gap-2"
                 >
                   {copied ? <Check size={18} /> : <Copy size={18} />}
                   {copied ? 'SQL COPIED' : 'COPY SQL SCRIPT'}
                 </button>
               </div>
               
               <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                 <div className="flex justify-between items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Sparkles size={12} className="text-blue-400" /> Database Repair Script
                   </div>
                 </div>
                 <pre className="p-6 overflow-x-auto text-[11px] font-mono text-blue-200 leading-relaxed max-h-48 overflow-y-auto thin-scrollbar">
                   {settingsFixSql}
                 </pre>
               </div>
             </div>
           </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Branding & Content */}
        <div className="lg:col-span-7 space-y-12">
          {/* Identity Section */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <SectionHeader 
              icon={<Globe size={20} />} 
              title="Site Identity" 
              desc="How your site appears to search engines and users."
            />
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website Name</label>
                <input
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold dark:text-white transition-all"
                  value={settings.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  placeholder="Future Flow Hub"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tagline / Headline</label>
                <input
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold dark:text-white transition-all"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Your Daily Dose of Innovation"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meta Description</label>
                <textarea
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-medium dark:text-white h-32 transition-all"
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Exploring the frontiers of technology..."
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
             <SectionHeader 
               icon={<ShieldCheck size={20} />} 
               title="Social Profiles" 
               desc="Connect your community across platforms."
             />
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <Facebook size={12} /> Facebook
                 </label>
                 <input
                   className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs dark:text-white"
                   value={settings.social_links?.facebook || ''}
                   onChange={(e) => handleChange('social_links', { ...settings.social_links, facebook: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <Instagram size={12} /> Instagram
                 </label>
                 <input
                   className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs dark:text-white"
                   value={settings.social_links?.instagram || ''}
                   onChange={(e) => handleChange('social_links', { ...settings.social_links, instagram: e.target.value })}
                 />
               </div>
             </div>
          </section>
        </div>

        {/* Right Column: Visual Theme */}
        <div className="lg:col-span-5 space-y-12">
          {/* Brand Assets */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
             <SectionHeader 
               icon={<ImageIcon size={20} />} 
               title="Brand Assets" 
               desc="Logo and favicon for branding."
             />
             
             <div className="space-y-8">
               <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Logo</label>
                   {settings.logo_url && <button onClick={() => handleChange('logo_url', '')} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>}
                 </div>
                 <div className="flex flex-col gap-4">
                   <div className="h-24 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative group">
                      {settings.logo_url ? (
                        <img src={settings.logo_url} className="h-16 object-contain" alt="Logo" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={32} />
                      )}
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-xl">
                          {isUploading.logo ? <RefreshCcw size={16} className="animate-spin" /> : 'Upload New'}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                        </label>
                      </div>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Favicon (32x32)</label>
                 <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.favicon_url ? (
                        <img src={settings.favicon_url} className="w-8 h-8 object-contain" alt="Favicon" />
                      ) : (
                        <LayoutIcon className="text-gray-300" size={24} />
                      )}
                   </div>
                   <div className="flex-grow">
                     <label className="inline-block cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black px-6 py-3 rounded-xl text-xs font-bold transition-all w-full text-center">
                       {isUploading.favicon ? <RefreshCcw size={16} className="animate-spin mx-auto" /> : 'Change Favicon'}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} />
                     </label>
                   </div>
                 </div>
               </div>
             </div>
          </section>

          {/* Visual Language */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
             <SectionHeader 
               icon={<Palette size={20} />} 
               title="Visual Theme" 
               desc="Typography and brand color settings."
             />
             
             <div className="space-y-10">
                {/* Primary Color */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Primary Color</label>
                  <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="h-12 w-12 rounded-xl cursor-pointer border-none"
                    />
                    <div className="space-y-1">
                      <p className="font-mono text-xs font-bold dark:text-white uppercase tracking-widest">{settings.primary_color}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Applied to buttons, links & icons.</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="w-full py-2 rounded-lg text-black font-bold text-xs" style={{ backgroundColor: settings.primary_color }}>
                      Button Preview
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Font Family</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Inter', 'Merriweather', 'Space Grotesk'].map(font => (
                      <button
                        key={font}
                        onClick={() => handleChange('font_family', font)}
                        className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${settings.font_family === font ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800'}`}
                      >
                        <span className="font-bold text-black" style={{ fontFamily: font }}>{font}</span>
                        {settings.font_family === font && <Check size={18} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Mode */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Site Container Width</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleChange('layout_mode', 'wide')}
                      className={`p-6 rounded-2xl border-2 transition-all text-center space-y-3 ${settings.layout_mode === 'wide' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50'}`}
                    >
                      <Maximize size={24} className={`mx-auto ${settings.layout_mode === 'wide' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="text-xs font-bold text-black">Wide Screen</p>
                    </button>
                    <button 
                      onClick={() => handleChange('layout_mode', 'boxed')}
                      className={`p-6 rounded-2xl border-2 transition-all text-center space-y-3 ${settings.layout_mode === 'boxed' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50'}`}
                    >
                      <Minimize size={24} className={`mx-auto ${settings.layout_mode === 'boxed' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="text-xs font-bold text-black">Boxed Center</p>
                    </button>
                  </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};
