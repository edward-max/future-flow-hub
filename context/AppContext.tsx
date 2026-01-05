
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isSavingSettings: boolean;
  dbStatus: { categories: boolean; posts: boolean; subscribers: boolean; settings: boolean };
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
  incrementPostViews: (postId: string) => Promise<void>;
  incrementSiteVisits: () => Promise<void>;
  addSubscriber: (email: string) => Promise<{ success: boolean; message: string }>;
  removeSubscriber: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(() => getFromStorage('ffh_settings_local', INITIAL_SETTINGS));
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dbStatus, setDbStatus] = useState({ categories: true, posts: true, subscribers: true, settings: true });

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch Posts
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

      // Fetch Categories
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

      // Fetch Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();
      
      if (!settingsError && settingsData) {
        setSettings(settingsData);
        setDbStatus(prev => ({ ...prev, settings: true }));
        saveToStorage('ffh_settings_local', settingsData);
      } else {
        if (settingsError?.code === 'PGRST204' || settingsError?.code === 'PGRST205' || settingsError?.message?.includes('cache')) {
          setDbStatus(prev => ({ ...prev, settings: false }));
        } else if (!settingsError && !settingsData) {
          setDbStatus(prev => ({ ...prev, settings: true }));
        } else {
          setDbStatus(prev => ({ ...prev, settings: false }));
        }
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
  }, [isAdminMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const login = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Login failed" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const incrementPostViews = async (postId: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_id: postId });
      // Fallback if RPC is not available
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase.from('posts').update({ views: (post.views || 0) + 1 }).eq('id', postId);
      }
    } catch (err) {
      console.error("View count error", err);
    }
  };

  const incrementSiteVisits = async () => {
    try {
      const currentVisits = settings.total_visits || 0;
      await supabase.from('settings').update({ total_visits: currentVisits + 1 }).eq('id', 'main');
    } catch (err) {
      console.error("Site visit error", err);
    }
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveToStorage('ffh_settings_local', newSettings);
    setIsSavingSettings(true);

    try {
      const dbPayload = {
        id: 'main',
        site_name: newSettings.site_name,
        tagline: newSettings.tagline,
        description: newSettings.description,
        logo_url: newSettings.logo_url,
        favicon_url: newSettings.favicon_url,
        primary_color: newSettings.primary_color,
        font_family: newSettings.font_family,
        layout_mode: newSettings.layout_mode,
        theme_mode: newSettings.theme_mode,
        social_links: newSettings.social_links,
        total_visits: newSettings.total_visits,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('settings').upsert(dbPayload);
      if (error && (error.code === 'PGRST205' || error.code === 'PGRST204')) {
        setDbStatus(prev => ({ ...prev, settings: false }));
      } else if (!error) {
        setDbStatus(prev => ({ ...prev, settings: true }));
      }
    } catch (err: any) {
      setDbStatus(prev => ({ ...prev, settings: false }));
    } finally {
      setIsSavingSettings(false);
    }
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
    if (error) throw new Error(error.message || JSON.stringify(error));
    await fetchData();
  };

  const updatePost = async (post: BlogPost) => {
    const { id, created_at, updated_at, ...updateData } = post;
    const { error } = await supabase.from('posts').update(updateData).eq('id', id);
    if (error) throw new Error(error.message || JSON.stringify(error));
    await fetchData();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message || "Failed to delete post.");
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
      posts, categories, settings, subscribers, isLoading, isAdminMode, isSavingSettings, dbStatus, user,
      refreshData: fetchData,
      login, logout, addPost, updatePost, deletePost,
      addCategory, updateCategory, deleteCategory,
      updateSettings, incrementPostViews, incrementSiteVisits, addSubscriber, removeSubscriber
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
