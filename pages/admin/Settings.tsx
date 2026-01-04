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
        handleChange('logo_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('favicon_url', reader.result as string);
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
          <h2 className="text-lg font-bold mb-4 pb-2 border-b text-blue-900">Branding & Identity</h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Site Name</label>
               <input
                 className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-900 outline-none"
                 value={settings.site_name}
                 onChange={(e) => handleChange('site_name', e.target.value)}
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Logo Image</label>
               <div className="space-y-3">
                 <input
                   className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                   placeholder="https://example.com/logo.png"
                   value={settings.logo_url || ''}
                   onChange={(e) => handleChange('logo_url', e.target.value)}
                 />
                 <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded bg-gray-50">
                    <span className="text-sm text-gray-500 whitespace-nowrap font-medium">Upload Logo:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                    />
                 </div>
               </div>
               
               {settings.logo_url && (
                 <div className="mt-3 p-4 border rounded bg-gray-50 flex items-center justify-center relative group">
                   <img src={settings.logo_url} alt="Preview" className="h-16 object-contain" />
                   <button 
                       onClick={() => handleChange('logo_url', '')}
                       className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1.5 transition-colors"
                       title="Remove Logo"
                   >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
               )}
             </div>

             <div className="border-t border-gray-100 pt-4 mt-4">
               <label className="block text-sm font-medium mb-1">Favicon (Browser Tab Icon)</label>
               <div className="space-y-3">
                 <input
                   className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                   placeholder="https://example.com/favicon.ico"
                   value={settings.favicon_url || ''}
                   onChange={(e) => handleChange('favicon_url', e.target.value)}
                 />
                 <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded bg-gray-50">
                    <span className="text-sm text-gray-500 whitespace-nowrap font-medium">Upload Favicon:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                    />
                 </div>
               </div>
               
               {settings.favicon_url && (
                 <div className="mt-3 p-4 border rounded bg-gray-50 flex items-center justify-center relative group">
                   <img src={settings.favicon_url} alt="Favicon Preview" className="h-8 w-8 object-contain" />
                   <button 
                       onClick={() => handleChange('favicon_url', '')}
                       className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1.5 transition-colors"
                       title="Remove Favicon"
                   >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
               )}
             </div>

             <div className="border-t border-gray-100 pt-4">
               <label className="block text-sm font-medium mb-1">Tagline</label>
               <input
                 className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-900 outline-none"
                 value={settings.tagline}
                 onChange={(e) => handleChange('tagline', e.target.value)}
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Description (Footer/SEO)</label>
               <textarea
                 className="w-full border rounded px-3 py-2 h-20 focus:ring-2 focus:ring-blue-900 outline-none"
                 value={settings.description}
                 onChange={(e) => handleChange('description', e.target.value)}
               />
             </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b text-blue-900">Visual Theme</h2>
          <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium mb-2">Primary Color</label>
               <div className="flex gap-4">
                 <input
                   type="color"
                   value={settings.primary_color}
                   onChange={(e) => handleChange('primary_color', e.target.value)}
                   className="h-10 w-20 rounded cursor-pointer border border-gray-200"
                 />
                 <div className="flex-1 text-xs text-gray-500 flex items-center">
                   Pick a brand color for the public frontend elements.
                 </div>
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-2">Typography</label>
               <div className="grid grid-cols-3 gap-3">
                 {['Inter', 'Merriweather', 'Space Grotesk'].map(font => (
                   <button
                     key={font}
                     onClick={() => handleChange('font_family', font)}
                     className={`border rounded px-3 py-2 text-sm transition-all ${settings.font_family === font ? 'border-blue-900 bg-blue-50 text-blue-900 font-bold' : 'hover:bg-gray-50'}`}
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
                      checked={settings.layout_mode === 'wide'}
                      onChange={() => handleChange('layout_mode', 'wide')}
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span className="text-sm">Full Width</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="layout"
                      checked={settings.layout_mode === 'boxed'}
                      onChange={() => handleChange('layout_mode', 'boxed')}
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span className="text-sm">Boxed</span>
                  </label>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};