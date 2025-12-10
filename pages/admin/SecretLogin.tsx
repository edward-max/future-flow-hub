import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, User } from 'lucide-react';

export const SecretLogin: React.FC = () => {
  const { isAdminMode, login } = useApp();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isAdminMode) {
      navigate('/admin/dashboard');
    }
  }, [isAdminMode, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Access denied.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Admin Portal</h1>
        <p className="mb-6 text-gray-500 text-sm">Please authenticate to continue.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter username"
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password"
                required
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 mt-2"
          >
            Authenticate
          </button>
        </form>
        
        <p className="mt-6 text-xs text-gray-400">
          Unauthorized access is prohibited and logged.
        </p>
      </div>
    </div>
  );
};