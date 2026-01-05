
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { BlogList } from './pages/public/BlogList';
import { PostDetail } from './pages/public/PostDetail';
import { Contact } from './pages/public/Contact';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { PostManager } from './pages/admin/PostManager';
import { CategoryManager } from './pages/admin/CategoryManager';
import { Settings } from './pages/admin/Settings';
import { Newsletter } from './pages/admin/Newsletter';
import { SecretLogin } from './pages/admin/SecretLogin';

const About = () => (
  <div className="container mx-auto py-16 px-4">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">About Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        We are a forward-thinking blog platform dedicated to technology, finance, and human progress.
      </p>
    </div>
  </div>
);

// Wrapper to handle global visit tracking
const SiteInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { incrementSiteVisits } = useApp();
  
  useEffect(() => {
    // Only track site visit once per session
    const hasVisited = sessionStorage.getItem('ffh_visited_session');
    if (!hasVisited) {
      incrementSiteVisits();
      sessionStorage.setItem('ffh_visited_session', 'true');
    }
  }, []);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <SiteInit>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/blog" element={<Layout><BlogList /></Layout>} />
            <Route path="/post/:category/:slug" element={<Layout><PostDetail /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />

            <Route path="/secure-admin-entry" element={<SecretLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Navigate to="dashboard" />} />
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="posts" element={<PostManager />} />
               <Route path="categories" element={<CategoryManager />} />
               <Route path="settings" element={<Settings />} />
               <Route path="newsletter" element={<Newsletter />} />
            </Route>
          </Routes>
        </Router>
      </SiteInit>
    </AppProvider>
  );
};

export default App;
