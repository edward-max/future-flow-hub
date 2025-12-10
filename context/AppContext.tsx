
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, Category, SiteSettings, Comment, Subscriber } from '../types';
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_SUBSCRIBERS, ADMIN_CREDENTIALS } from '../constants';
import { getFromStorage, saveToStorage } from '../services/storage';

interface AppContextType {
  posts: BlogPost[];
  categories: Category[];
  settings: SiteSettings;
  subscribers: Subscriber[];
  isAdminMode: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  updateSettings: (settings: SiteSettings) => void;
  addCategory: (category: Category) => void;
  addComment: (postId: string, comment: Comment) => void;
  addSubscriber: (email: string) => { success: boolean; message: string };
  removeSubscriber: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => getFromStorage('ffh_posts', INITIAL_POSTS));
  const [categories, setCategories] = useState<Category[]>(() => getFromStorage('ffh_categories', INITIAL_CATEGORIES));
  const [settings, setSettings] = useState<SiteSettings>(() => getFromStorage('ffh_settings', INITIAL_SETTINGS));
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => getFromStorage('ffh_subscribers', INITIAL_SUBSCRIBERS));
  
  // Use session storage for auth state so it persists on refresh but clears on browser close
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Apply Theme Side Effect
  useEffect(() => {
    if (settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.themeMode]);

  // Apply Favicon Side Effect
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (settings.faviconUrl) {
      link.href = settings.faviconUrl;
    }
  }, [settings.faviconUrl]);

  useEffect(() => {
    saveToStorage('ffh_posts', posts);
  }, [posts]);

  useEffect(() => {
    saveToStorage('ffh_categories', categories);
  }, [categories]);

  useEffect(() => {
    saveToStorage('ffh_settings', settings);
  }, [settings]);

  useEffect(() => {
    saveToStorage('ffh_subscribers', subscribers);
  }, [subscribers]);

  const login = (u: string, p: string) => {
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      setIsAdminMode(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminMode(false);
  };

  const addPost = (post: BlogPost) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (updatedPost: BlogPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const addComment = (postId: string, comment: Comment) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = p.comments ? [...p.comments, comment] : [comment];
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  };

  const addSubscriber = (email: string) => {
    const exists = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: "This email is already subscribed." };
    }
    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email,
      date: new Date().toLocaleDateString()
    };
    setSubscribers(prev => [...prev, newSubscriber]);
    return { success: true, message: "Successfully subscribed!" };
  };

  const removeSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{
      posts,
      categories,
      settings,
      subscribers,
      isAdminMode,
      login,
      logout,
      addPost,
      updatePost,
      deletePost,
      updateSettings,
      addCategory,
      addComment,
      addSubscriber,
      removeSubscriber
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
