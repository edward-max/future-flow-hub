import React from 'react';
import { useApp } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ ...settings, [key]: value });
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
               <label className="block text-sm font-medium mb-1">Logo URL</label>
               <input
                 className="w-full border rounded px-3 py-2 text-sm"
                 placeholder="https://example.com/logo.png"
                 value={settings.logoUrl || ''}
                 onChange={(e) => handleChange('logoUrl', e.target.value)}
               />
               {settings.logoUrl && (
                 <div className="mt-2 p-2 border rounded bg-gray-50 flex items-center justify-center">
                   <img src={settings.logoUrl} alt="Preview" className="h-12 object-contain" />
                 </div>
               )}
             </div>
             <div>
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
                   className="h-10 w-20 rounded cursor-pointer"
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
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="layout"
                      checked={settings.layoutMode === 'wide'}
                      onChange={() => handleChange('layoutMode', 'wide')}
                    />
                    <span className="text-sm">Full Width</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="layout"
                      checked={settings.layoutMode === 'boxed'}
                      onChange={() => handleChange('layoutMode', 'boxed')}
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