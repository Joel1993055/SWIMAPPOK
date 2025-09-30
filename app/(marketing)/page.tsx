import AspectDashboard from '../marketing/components/aspect-dashboard';
import AspectFaq from '../marketing/components/aspect-faq';
import AspectHero from '../marketing/components/aspect-hero';
import AspectLogos from '../marketing/components/aspect-logos';
import AspectPricing from '../marketing/components/aspect-pricing';
import AspectSeparator from '../marketing/components/aspect-separator';
import { AspectTabs } from '../marketing/components/aspect-tabs';
import AspectTestimonials from '../marketing/components/aspect-testimonials';
import AspectWorldMap from '../marketing/components/aspect-world-map';

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
