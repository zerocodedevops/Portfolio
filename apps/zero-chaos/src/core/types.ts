export interface ClientConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  contact: {
    email: string;
  };
  seo: {
    mainTitle: string;
    mainDescription: string;
  };
}

export interface BarrioConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
}

export interface ServiceConfig {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullContent: string;
  faqs: { question: string; answer: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image?: string;
}

export interface ProjectConfig {
  id: string;
  title: string;
  description: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  details: string[];
  tags: string[];
}
