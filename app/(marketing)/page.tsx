import AspectDashboard from '@/app/marketing/components/aspect-dashboard';
import AspectFaq from '@/app/marketing/components/aspect-faq';
import AspectHero from '@/app/marketing/components/aspect-hero';
import AspectLogos from '@/app/marketing/components/aspect-logos';
import AspectPricing from '@/app/marketing/components/aspect-pricing';
import AspectSeparator from '@/app/marketing/components/aspect-separator';
import { AspectTabs } from '@/app/marketing/components/aspect-tabs';
import AspectTestimonials from '@/app/marketing/components/aspect-testimonials';
import AspectWorldMap from '@/app/marketing/components/aspect-world-map';

export default function Home() {
  return (
    <>
      <AspectHero />
      <AspectLogos />
      <AspectTabs />
      <AspectTestimonials />
      <AspectDashboard />
      <AspectWorldMap />
      <AspectFaq />
      <AspectPricing />
      <AspectSeparator />
    </>
  );
}
