import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react';

export const SecretLogin: React.FC = () => {
  const { isAdminMode, toggleAdminMode } = useApp();
  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isAdminMode) {
      navigate('/admin/dashboard');
    }
  }, [isAdminMode, navigate]);

  const handleLogin = () => {
    if (!isAdminMode) {
      toggleAdminMode();
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Secure Admin Entry</h1>
        <p className="mb-8 text-gray-500 text-sm">You have accessed the restricted management portal. Click below to verify access.</p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
        >
          Access Dashboard
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
          Unauthorized access is prohibited. <br/> IP Logged: 192.168.x.x
        </p>
      </div>
    </div>
  );
};