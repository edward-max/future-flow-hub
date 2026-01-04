

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  // Metadata
  author?: string;
  category?: string;
  tags?: string[];
  is_featured?: boolean;
  views?: number;
  meta_title?: string;
  meta_description?: string;
  comments?: any[];
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  tagline: string;
  description: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  font_family: 'Inter' | 'Merriweather' | 'Space Grotesk';
  layout_mode: 'wide' | 'boxed';
  theme_mode: 'light' | 'dark';
  social_links: {
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
    instagram?: string;
  };
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}
