import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, FileText, Settings, LogOut, Grid, Mail } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAdminMode, logout } = useApp();

  if (!isAdminMode) {
    return <Navigate to="/" />;
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
           <span className="text-2xl font-bold text-gray-800">FFH Admin</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
           <NavLink to="/admin/dashboard" className={navClass}>
             <LayoutDashboard size={20} /> Dashboard
           </NavLink>
           <NavLink to="/admin/posts" className={navClass}>
             <FileText size={20} /> Posts
           </NavLink>
           <NavLink to="/admin/categories" className={navClass}>
             <Grid size={20} /> Categories
           </NavLink>
           <NavLink to="/admin/newsletter" className={navClass}>
             <Mail size={20} /> Newsletter
           </NavLink>
           <NavLink to="/admin/settings" className={navClass}>
             <Settings size={20} /> Settings
           </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200">
           <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
             <LogOut size={20} /> Log Out
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};