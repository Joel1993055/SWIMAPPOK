
import AspectContactForm from '@/app/marketing/components/aspect-contact-form';
import AspectContactHero from '@/app/marketing/components/aspect-contact-hero';
import AspectSeparator from '@/app/marketing/components/aspect-separator';

const ContactPage = () => {
  return (
    <>
      <AspectContactHero />
      <AspectSeparator />
      <AspectContactForm />
      <AspectSeparator />
    </>
  );
};

export default ContactPage;
