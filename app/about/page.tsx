import AspectAboutHero from '@/app/marketing/components/aspect-about-hero';
import AspectOpenPositions from '@/app/marketing/components/aspect-open-positions';
import AspectSeparator from '@/app/marketing/components/aspect-separator';
import AspectSplitSection from '@/app/marketing/components/aspect-split-section';
import AspectTeamCarousel from '@/app/marketing/components/aspect-team-carousel';

export default function AboutPage() {
  return (
    <>
      <AspectAboutHero />
      <AspectSeparator />
      <AspectTeamCarousel />
      <AspectSplitSection
        header="Life at DECKapp"
        description="We believe that great work comes from happy, inspired teams. That's why we offer unlimited paid vacation, quarterly team-building retreats, and monthly hack days where anyone can pitch new ideas and build prototypes. From swimming competitions to board-game nights in our office, we're always finding fresh ways to connect beyond the screen."
        image="/images/about/split-section/1.webp"
        side="R"
      />
      <AspectSplitSection
        header="Wellness & Perks"
        description="Your health matters to us. Every DECKapp employee gets a Fit Pass—full access to partner gyms, swimming pools, and wellness classes across the city. We also host weekly guided meditation sessions, subsidize healthy meal deliveries, and provide ergonomic gear so you can feel your best, on and off the clock."
        image="/images/about/split-section/2.webp"
        side="L"
      />
      <AspectSeparator />
      <AspectOpenPositions />
      <AspectSeparator />
    </>
  );
}
