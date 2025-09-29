export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  tagline?: string;
  tags?: string[];
}

export const sampleBlogPosts: BlogPost[] = [
  {
    slug: 'swimming-analytics-guide',
    title: 'Complete Guide to Swimming Analytics',
    description: 'Learn how to use DECKapp analytics to improve your swimming performance and track progress effectively.',
    coverImage: '/images/blog/1.webp',
    date: '2024-01-15',
    tagline: 'Analytics · Jan 15',
    tags: ['Analytics', 'Performance'],
  },
  {
    slug: 'team-management-tips',
    title: 'Effective Team Management Strategies',
    description: 'Discover the best practices for managing swimming teams and optimizing training schedules.',
    coverImage: '/images/blog/2.webp',
    date: '2024-01-10',
    tagline: 'Management · Jan 10',
    tags: ['Team Management', 'Training'],
  },
  {
    slug: 'swimming-technique-analysis',
    title: 'Advanced Swimming Technique Analysis',
    description: 'Deep dive into swimming technique analysis and how technology can help improve form.',
    coverImage: '/images/blog/3.webp',
    date: '2024-01-05',
    tagline: 'Technique · Jan 5',
    tags: ['Technique', 'Analysis'],
  },
  {
    slug: 'competition-preparation',
    title: 'Competition Preparation Guide',
    description: 'Everything you need to know about preparing for swimming competitions using DECKapp.',
    coverImage: '/images/blog/4.webp',
    date: '2024-01-01',
    tagline: 'Competition · Jan 1',
    tags: ['Competition', 'Preparation'],
  },
];
