
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Eye, FileText, Users, Database, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle, Grid, Globe } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { posts, categories, dbStatus, subscribers, settings } = useApp();
  const navigate = useNavigate();
  const totalPostViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
       <div>
         <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
         <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
       </div>
       <div className={`p-3 rounded-lg ${color} text-white`}>
         {icon}
       </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <div className="flex gap-2">
          {dbStatus.posts ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
              <ShieldCheck size={14} /> Systems Operational
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 animate-pulse">
              <ShieldAlert size={14} /> Sync Issue
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Site Visits" value={(settings.total_visits || 0).toLocaleString()} icon={<Globe size={24} />} color="bg-blue-600" />
        <StatCard title="Post Impressions" value={totalPostViews.toLocaleString()} icon={<Eye size={24} />} color="bg-indigo-600" />
        <StatCard title="Active Stories" value={posts.length} icon={<FileText size={24} />} color="bg-violet-600" />
        <StatCard title="Community" value={subscribers.length} icon={<Users size={24} />} color="bg-emerald-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Top Performing Content</h3>
            <button onClick={() => navigate('/admin/posts')} className="text-sm font-bold text-blue-900 hover:underline">Full Report</button>
          </div>
          <div className="space-y-4">
            {[...posts].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map(post => (
              <div key={post.id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                 <div className="flex flex-col">
                   <span className="font-bold text-gray-800 line-clamp-1">{post.title}</span>
                   <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{post.category} • {post.views || 0} views</span>
                 </div>
                 <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {post.published ? 'Active' : 'Draft'}
                 </span>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="py-10 text-center text-gray-400">
                <p className="font-medium">No activity recorded yet.</p>
                <button onClick={() => navigate('/admin/posts')} className="mt-2 text-blue-900 font-bold underline">Create your first story</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl shadow-gray-200 border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Globe size={80} />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Database size={20} className="text-blue-400" /> Cloud Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Content Storage</span>
                {dbStatus.posts ? <CheckCircle size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-amber-400" />}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Site Analytics</span>
                {dbStatus.settings ? <CheckCircle size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-amber-400" />}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subscriber Vault</span>
                {dbStatus.subscribers ? <CheckCircle size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-amber-400" />}
              </div>
              
              {!dbStatus.settings && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-200 leading-relaxed font-medium">
                    New tracking features detected. Visit <strong>Appearance Settings</strong> to run the SQL update script.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Growth Tools</h3>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => navigate('/admin/posts')} className="p-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-gray-100 transition-all">New Post</button>
               <button onClick={() => navigate('/admin/newsletter')} className="p-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-gray-100 transition-all">Leads</button>
               <button onClick={() => navigate('/admin/settings')} className="p-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-gray-100 transition-all">Design</button>
               <button onClick={() => navigate('/admin/categories')} className="p-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-900 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-gray-100 transition-all">Topics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
