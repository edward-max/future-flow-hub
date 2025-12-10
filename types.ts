
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML/Rich Text
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured: boolean;
  views: number;
  comments?: Comment[];
  // SEO
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string; // Hex code
  fontFamily: 'Inter' | 'Merriweather' | 'Space Grotesk';
  layoutMode: 'wide' | 'boxed';
  themeMode: 'light' | 'dark';
  socialLinks: {
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
    instagram?: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  user: string;
  text: string;
  date: string;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'guest';
}
