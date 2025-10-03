import experiencesData from '@/data/experiences.json';
import projectsData from '@/data/projects.json';
import blogsData from '@/data/blogs.json';
import user from '@/data/user.json';

export interface UserData {
  full_name?: string;
  email?: string;
  bio?: string;
  title?: string;
  location?: string;
  profile_image_url?: string;
  github_url?: string;
  linkedin_url?: string;
  resume_url?: string;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  start_date: string | null;
  end_date: string | null;
  description?: string;
  type: "education" | "work" | "research";
  current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  category: "machine_learning" | "deep_learning" | "data_science" | "web_development" | "other";
  featured: boolean;
  created_date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url?: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  created_date: string;
  likes: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  author: string;
  message: string;
  date: string;
}

export const getUserData = (): UserData => {
    return user as UserData;
};

export const getExperiences = (): Experience[] => {
  return experiencesData as Experience[];
};

export const getProjects = (): Project[] => {
  return projectsData as Project[];
};

export const getBlogPosts = (): BlogPost[] => {
  return blogsData.filter(blog => blog.status === 'published') as BlogPost[];
};

export const getFeaturedProjects = (): Project[] => {
  return projectsData.filter(project => project.featured) as Project[];
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projectsData as Project[];
  return projectsData.filter(project => project.category === category) as Project[];
};
