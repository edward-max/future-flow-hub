
import React from 'react';
import { useApp } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ ...settings, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('faviconUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Site Customization</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branding */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b">Branding & Identity</h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Site Name</label>
               <input
                 className="w-full border rounded px-3 py-2"
                 value={settings.siteName}
                 onChange={(e) => handleChange('siteName', e.target.value)}
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Logo Image</label>
               <div className="space-y-3">
                 <input
                   className="w-full border rounded px-3 py-2 text-sm"
                   placeholder="https://example.com/logo.png"
                   value={settings.logoUrl || ''}
                   onChange={(e) => handleChange('logoUrl', e.target.value)}
                 />
                 <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded bg-gray-50">
                    <span className="text-sm text-gray-500 whitespace-nowrap font-medium">Upload Logo:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                 </div>
               </div>
               
               {settings.logoUrl && (
                 <div className="mt-3 p-4 border rounded bg-gray-50 flex items-center justify-center relative group">
                   <img src={settings.logoUrl} alt="Preview" className="h-16 object-contain" />
                   <button 
                       onClick={() => handleChange('logoUrl', '')}
                       className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1.5 transition-colors"
                       title="Remove Logo"
                   >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
               )}
               <p className="text-xs text-gray-400 mt-1">Supported formats: PNG, JPG, GIF, SVG.</p>
             </div>

             <div className="border-t border-gray-100 pt-4 mt-4">
               <label className="block text-sm font-medium mb-1">Favicon (Browser Tab Icon)</label>
               <div className="space-y-3">
                 <input
                   className="w-full border rounded px-3 py-2 text-sm"
                   placeholder="https://example.com/favicon.ico"
                   value={settings.faviconUrl || ''}
                   onChange={(e) => handleChange('faviconUrl', e.target.value)}
                 />
                 <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded bg-gray-50">
                    <span className="text-sm text-gray-500 whitespace-nowrap font-medium">Upload Favicon:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                 </div>
               </div>
               
               {settings.faviconUrl && (
                 <div className="mt-3 p-4 border rounded bg-gray-50 flex items-center justify-center relative group">
                   <img src={settings.faviconUrl} alt="Favicon Preview" className="h-8 w-8 object-contain" />
                   <button 
                       onClick={() => handleChange('faviconUrl', '')}
                       className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1.5 transition-colors"
                       title="Remove Favicon"
                   >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
               )}
               <p className="text-xs text-gray-400 mt-1">Recommended size: 32x32px or 64x64px. PNG or ICO.</p>
             </div>

             <div className="border-t border-gray-100 pt-4">
               <label className="block text-sm font-medium mb-1">Tagline</label>
               <input
                 className="w-full border rounded px-3 py-2"
                 value={settings.tagline}
                 onChange={(e) => handleChange('tagline', e.target.value)}
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Description (Footer/SEO)</label>
               <textarea
                 className="w-full border rounded px-3 py-2 h-20"
                 value={settings.description}
                 onChange={(e) => handleChange('description', e.target.value)}
               />
             </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b">Visual Theme</h2>
          <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium mb-2">Primary Color</label>
               <div className="flex gap-4">
                 <input
                   type="color"
                   value={settings.primaryColor}
                   onChange={(e) => handleChange('primaryColor', e.target.value)}
                   className="h-10 w-20 rounded cursor-pointer border border-gray-200"
                 />
                 <div className="flex-1 text-xs text-gray-500 flex items-center">
                   Pick a brand color. This will affect buttons, links, and highlights.
                 </div>
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-2">Typography</label>
               <div className="grid grid-cols-3 gap-3">
                 {['Inter', 'Merriweather', 'Space Grotesk'].map(font => (
                   <button
                     key={font}
                     onClick={() => handleChange('fontFamily', font)}
                     className={`border rounded px-3 py-2 text-sm ${settings.fontFamily === font ? 'border-[var(--primary)] bg-[var(--primary)]/10 font-bold' : 'hover:bg-gray-50'}`}
                     style={{ fontFamily: font }}
                   >
                     {font}
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">Layout Mode</label>
               <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="layout"
                      checked={settings.layoutMode === 'wide'}
                      onChange={() => handleChange('layoutMode', 'wide')}
                      className="text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm">Full Width</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="layout"
                      checked={settings.layoutMode === 'boxed'}
                      onChange={() => handleChange('layoutMode', 'boxed')}
                      className="text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm">Boxed</span>
                  </label>
               </div>
             </div>
          </div>
        </div>

        {/* Social Links */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b">Social Connections</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium mb-1">Facebook URL</label>
               <input
                 className="w-full border rounded px-3 py-2"
                 value={settings.socialLinks.facebook || ''}
                 onChange={(e) => updateSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})}
               />
            </div>
             <div>
               <label className="block text-sm font-medium mb-1">Instagram URL</label>
               <input
                 className="w-full border rounded px-3 py-2"
                 value={settings.socialLinks.instagram || ''}
                 onChange={(e) => updateSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
