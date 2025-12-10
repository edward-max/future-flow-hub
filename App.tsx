import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { BlogList } from './pages/public/BlogList';
import { PostDetail } from './pages/public/PostDetail';
import { Contact } from './pages/public/Contact';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { PostManager } from './pages/admin/PostManager';
import { Settings } from './pages/admin/Settings';
import { Newsletter } from './pages/admin/Newsletter';
import { SecretLogin } from './pages/admin/SecretLogin';

const About = () => (
  <div className="container mx-auto py-16 px-4">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">About Us</h1>
      <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-left md:text-center">
        <p>
          FutureFlow Hub is built for anyone who wants to understand the new world of technology, money, and digital innovation. We simplify complex topics and turn them into practical, easy-to-use insights that help you make smarter decisions in your daily life and long-term goals.
        </p>
        <p>
          From emerging tech trends and investment basics to AI tools, productivity resources, and personal growth strategies, our mission is to give you content that is clear, actionable, and future-focused.
        </p>
        <p>
          We believe the future belongs to those who stay curious, stay informed, and stay ready. That’s why every article, guide, and resource on FutureFlow Hub is created to empower you with knowledge that actually matters.
        </p>
        <p className="font-bold text-gray-800 dark:text-gray-100 mt-8 text-xl">
          Welcome to your hub for smarter learning, digital growth, and future-ready living.
        </p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes Wrapped in Main Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/blog" element={<Layout><BlogList /></Layout>} />
          <Route path="/post/:slug" element={<Layout><PostDetail /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />

          {/* Secure Admin Entry Link */}
          <Route path="/secure-admin-entry" element={<SecretLogin />} />

          {/* Admin Routes Wrapped in Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="dashboard" />} />
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="posts" element={<PostManager />} />
             <Route path="settings" element={<Settings />} />
             <Route path="newsletter" element={<Newsletter />} />
             {/* Placeholder for categories */}
             <Route path="categories" element={<div className="text-center p-8 text-gray-500">Category management coming soon.</div>} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;