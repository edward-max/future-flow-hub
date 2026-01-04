
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, Category, SiteSettings, Subscriber } from '../types';
import { INITIAL_SETTINGS, INITIAL_CATEGORIES } from '../constants';
import { supabase } from '../services/supabase';
import { getFromStorage, saveToStorage } from '../services/storage';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  posts: BlogPost[];
  categories: Category[];
  settings: SiteSettings;
  subscribers: Subscriber[];
  isLoading: boolean;
  isAdminMode: boolean;
  dbStatus: { categories: boolean; posts: boolean; subscribers: boolean };
  user: User | null;
  refreshData: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addPost: (post: Omit<BlogPost, 'id' | 'created_at'>) => Promise<void>;
  updatePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<{ success: boolean; error?: any; fallback?: boolean }>;
  updateCategory: (category: Category) => Promise<{ success: boolean; error?: any; fallback?: boolean }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: any; fallback?: boolean }>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  addSubscriber: (email: string) => Promise<{ success: boolean; message: string }>;
  removeSubscriber: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [dbStatus, setDbStatus] = useState({ categories: true, posts: true, subscribers: true });

  const isAdminMode = !!user;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsError) {
        setDbStatus(prev => ({ ...prev, posts: false }));
        setPosts(getFromStorage('ffh_posts_fallback', []));
      } else if (postsData) {
        setPosts(postsData);
        setDbStatus(prev => ({ ...prev, posts: true }));
        saveToStorage('ffh_posts_fallback', postsData);
      }

      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (catsError) {
        setDbStatus(prev => ({ ...prev, categories: false }));
        setCategories(getFromStorage('ffh_categories_fallback', INITIAL_CATEGORIES));
      } else if (catsData) {
        setCategories(catsData);
        setDbStatus(prev => ({ ...prev, categories: true }));
        saveToStorage('ffh_categories_fallback', catsData);
      }

      if (isAdminMode) {
        const { data: subsData, error: subsError } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (subsError) {
          setDbStatus(prev => ({ ...prev, subscribers: false }));
        } else if (subsData) {
          setSubscribers(subsData);
          setDbStatus(prev => ({ ...prev, subscribers: true }));
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdminMode]);

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, error: error.message };
    setUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addPost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => {
    const payload = {
      title: post.title,
      slug: post.slug.toLowerCase(),
      content: post.content,
      excerpt: post.excerpt || '',
      cover_image: post.cover_image || '',
      category: post.category || 'General',
      author: post.author || 'Admin',
      published: post.published ?? true,
      is_featured: post.is_featured || false,
      views: post.views || 0
    };

    const { error } = await supabase.from('posts').insert([payload]);
    if (error) {
      // Extract clear message to avoid [object Object]
      const errorMsg = error.message || JSON.stringify(error);
      console.error("Supabase Insertion Error:", errorMsg);
      throw new Error(errorMsg);
    }
    await fetchData();
  };

  const updatePost = async (post: BlogPost) => {
    // Only send fields that are part of the table schema
    const { id, created_at, updated_at, ...updateData } = post;
    
    const { error } = await supabase.from('posts').update(updateData).eq('id', id);
    if (error) {
      const errorMsg = error.message || JSON.stringify(error);
      console.error("Supabase Update Error:", errorMsg);
      throw new Error(errorMsg);
    }
    await fetchData();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      throw new Error(error.message || "Failed to delete post.");
    }
    await fetchData();
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert([category]);
    if (error) return { success: false, error };
    await fetchData();
    return { success: true };
  };

  const updateCategory = async (category: Category) => {
    const { error } = await supabase.from('categories').update(category).eq('id', category.id);
    if (!error) await fetchData();
    return { success: true, fallback: !!error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) await fetchData();
    return { success: true, fallback: !!error };
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addSubscriber = async (email: string) => {
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) return { success: false, message: error.message || "Subscription failed." };
    await fetchData();
    return { success: true, message: "Subscribed successfully!" };
  };

  const removeSubscriber = async (id: string) => {
    await supabase.from('subscribers').delete().eq('id', id);
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      posts, categories, settings, subscribers, isLoading, isAdminMode, dbStatus, user,
      refreshData: fetchData,
      login, logout, addPost, updatePost, deletePost,
      addCategory, updateCategory, deleteCategory,
      updateSettings, addSubscriber, removeSubscriber
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
