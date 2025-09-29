
import AspectPricing from '@/app/marketing/components/aspect-pricing';
import AspectPricingTable from '@/app/marketing/components/aspect-pricing-table';
import AspectSeparator from '@/app/marketing/components/aspect-separator';

const PricingPage = () => {
  return (
    <>
      <AspectPricing />
      <AspectSeparator />
      <AspectPricingTable />
      <AspectSeparator />
    </>
  );
};

export default PricingPage;