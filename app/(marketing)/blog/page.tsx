import AspectBlogHeader from '@/app/marketing/components/aspect-blog-header';
import AspectFeaturedPost from '@/app/marketing/components/aspect-featured-post';
import AspectPostGrid from '@/app/marketing/components/aspect-post-grid';
import { sampleBlogPosts } from '@/lib/blog';

const BlogPage = () => {
  const featuredPost = sampleBlogPosts[0]; // Usar el primer post como destacado

  return (
    <>
      <AspectBlogHeader />
      <AspectFeaturedPost 
        tagline={featuredPost.tagline || 'Featured Post'}
        header={featuredPost.title}
        description={featuredPost.description}
        image={featuredPost.coverImage}
        side="L"
        link={`/blog/${featuredPost.slug}`}
      />
      <AspectPostGrid posts={sampleBlogPosts} />
    </>
  );
};

export default BlogPage;
