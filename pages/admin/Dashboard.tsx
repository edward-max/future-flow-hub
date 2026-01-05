
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Eye, FileText, Users, Database, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle, Grid, Globe, Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { posts, categories, dbStatus, subscribers, settings } = useApp();
  const navigate = useNavigate();
  const totalPostViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const StatCard = ({ title, value, icon, color, subValue }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
       <div>
         <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
         <div className="flex items-baseline gap-2">
           <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
           {subValue && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{subValue}</span>}
         </div>
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
              <Zap size={12} className="fill-green-700" /> Live Data Sync
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 animate-pulse">
              <ShieldAlert size={14} /> Connection Interrupted
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Site Visits" value={(settings.total_visits || 0).toLocaleString()} icon={<Globe size={24} />} color="bg-blue-600" />
        <StatCard title="Post Impressions" value={totalPostViews.toLocaleString()} icon={<Eye size={24} />} color="bg-indigo-600" subValue="Total" />
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
                   <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{post.category}</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span className="text-xs font-black text-blue-600 flex items-center gap-1">
                        <Eye size={12} /> {post.views || 0} Views
                     </span>
                   </div>
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
              <Database size={20} className="text-blue-400" /> Engagement Engine
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">View Counting (RPC)</span>
                {dbStatus.posts ? <CheckCircle size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-amber-400" />}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Visitor Tracking</span>
                {dbStatus.settings ? <CheckCircle size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-amber-400" />}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-[10px] text-blue-200 leading-relaxed font-bold uppercase tracking-wider mb-1">PRO TIP</p>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  View counts update instantly in the UI and are permanently stored in Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
