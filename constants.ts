import { BlogPost, Category, SiteSettings, Subscriber } from './types';

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "FutureFlow2024!"
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "Future Flow Hub",
  tagline: "Your Daily Dose of Tech, Innovation & Future Insights",
  description: "Exploring the frontiers of technology, finance, and human progress.",
  logoUrl: "https://cdn.aistudio.google.com/9/8/a/side/502e6d62-10a4-4903-b09b-640b080b0642/4134442f.png",
  primaryColor: "#3b82f6", // Default Blue
  fontFamily: "Inter",
  layoutMode: "wide",
  themeMode: 'light',
  socialLinks: {
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

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: '1', email: 'demo@example.com', date: '2023-10-01' },
  { id: '2', email: 'fan@techflow.com', date: '2023-10-05' }
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Future of Artificial Intelligence in Africa",
    slug: "future-of-ai-africa",
    excerpt: "How emerging markets are leapfrogging legacy systems to build AI-first solutions.",
    content: "<h2>The AI Revolution</h2><p>Africa is poised to become a global leader in AI adoption...</p>",
    author: "Eddy",
    date: "2023-10-15",
    category: "AI",
    tags: ["Innovation", "Future", "Growth"],
    imageUrl: "https://picsum.photos/seed/ai/800/400",
    featured: true,
    views: 1240,
    metaTitle: "AI in Africa - Future Trends",
    metaDescription: "Explore how AI is reshaping the African continent.",
    comments: []
  },
  {
    id: '2',
    title: "Top 5 Ways to Start Investing with Less Than ₵100",
    slug: "investing-micro",
    excerpt: "You don't need a fortune to build wealth. Here are micro-investment strategies.",
    content: "<p>Micro-investing apps have changed the game...</p>",
    author: "Eddy",
    date: "2023-10-18",
    category: "Investments",
    tags: ["Finance", "Money", "Tips"],
    imageUrl: "https://picsum.photos/seed/money/800/400",
    featured: false,
    views: 890,
    comments: []
  },
  {
    id: '3',
    title: "Why Automation Is Reshaping Local Businesses",
    slug: "automation-local-business",
    excerpt: "Small businesses are adopting automation tools to compete with giants.",
    content: "<p>From chatbots to inventory management...</p>",
    author: "Eddy",
    date: "2023-10-20",
    category: "Tech",
    tags: ["Automation", "SaaS", "Business"],
    imageUrl: "https://picsum.photos/seed/tech/800/400",
    featured: true,
    views: 2100,
    comments: []
  },
  {
    id: '4',
    title: "The Rise of Cloud Tools in Modern Workspaces",
    slug: "cloud-tools-modern-work",
    excerpt: "Remote work is here to stay, and these tools make it possible.",
    content: "<p>Cloud computing has enabled...</p>",
    author: "Eddy",
    date: "2023-10-22",
    category: "Tech",
    tags: ["Remote Work", "Cloud", "Productivity"],
    imageUrl: "https://picsum.photos/seed/cloud/800/400",
    featured: false,
    views: 560,
    comments: []
  }
];