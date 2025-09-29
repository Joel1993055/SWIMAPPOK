
import { AspectFeatures } from '@/app/marketing/components/aspect-features';
import AspectFeaturesHero from '@/app/marketing/components/aspect-features-hero';
import AspectSeparator from '@/app/marketing/components/aspect-separator';
import AspectTestimonials from '@/app/marketing/components/aspect-testimonials';

const FeaturesPage = () => {
  return (
    <>
      <AspectFeaturesHero />
      <AspectFeatures />
      <AspectTestimonials />
      <AspectSeparator />
    </>
  );
};

export default FeaturesPage;
