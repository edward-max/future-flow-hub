import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, FileText, TrendingUp, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { posts, categories } = useApp();
  const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);

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
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Posts" value={posts.length} icon={<FileText size={24} />} color="bg-blue-500" />
        <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={<Eye size={24} />} color="bg-green-500" />
        <StatCard title="Categories" value={categories.length} icon={<Grid size={24} />} color="bg-purple-500" />
        <StatCard title="Subscribers" value="1,204" icon={<Users size={24} />} color="bg-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                 <span className="font-medium truncate max-w-[70%]">{post.title}</span>
                 <span className="text-sm text-gray-400">{post.views} views</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center text-sm font-medium">Write New Post</button>
             <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center text-sm font-medium">Manage Categories</button>
             <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center text-sm font-medium">Update SEO</button>
             <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center text-sm font-medium">Customize Theme</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple mock component for grid icon since it was missing in imports
const Grid = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);
