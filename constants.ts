import { BlogPost, Category, SiteSettings, Subscriber } from './types';

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "FutureFlow2024!"
};

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: "Future Flow Hub",
  tagline: "Your Daily Dose of Tech, Innovation & Future Insights",
  description: "Exploring the frontiers of technology, finance, and human progress.",
  logo_url: "https://cdn.aistudio.google.com/9/8/a/side/502e6d62-10a4-4903-b09b-640b080b0642/4134442f.png",
  favicon_url: "",
  primary_color: "#3b82f6", // Default Blue
  font_family: "Inter",
  layout_mode: "wide",
  theme_mode: 'light',
  social_links: {
    facebook: "https://web.facebook.com/profile.php?id=61584787324942",
    instagram: "https://www.instagram.com/future_flow_hub/"
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Tech', slug: 'tech' },
  { id: '2', name: 'AI', slug: 'ai' },
  { id: '3', name: 'Investments', slug: 'investments' },
  { id: '4', name: 'Startups', slug: 'startups' },
  { id: '5', name: 'Resources', slug: 'resources' },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Future of Artificial Intelligence in Africa",
    slug: "future-of-ai-africa",
    excerpt: "How emerging markets are leapfrogging legacy systems to build AI-first solutions.",
    content: "<h2>The AI Revolution</h2><p>Africa is poised to become a global leader in AI adoption...</p>",
    author: "Eddy",
    category: "AI",
    tags: ["Innovation", "Future", "Growth"],
    cover_image: "https://picsum.photos/seed/ai/800/400",
    published: true,
    is_featured: true,
    views: 1240,
    meta_title: "AI in Africa - Future Trends",
    meta_description: "Explore how AI is reshaping the African continent.",
    comments: [],
    created_at: "2023-10-15"
  },
  {
    id: '2',
    title: "Top 5 Ways to Start Investing with Less Than ₵100",
    slug: "investing-micro",
    excerpt: "You don't need a fortune to build wealth. Here are micro-investment strategies.",
    content: "<p>Micro-investing apps have changed the game...</p>",
    author: "Eddy",
    category: "Investments",
    tags: ["Finance", "Money", "Tips"],
    cover_image: "https://picsum.photos/seed/money/800/400",
    published: true,
    is_featured: false,
    views: 890,
    comments: [],
    created_at: "2023-10-18"
  }
];