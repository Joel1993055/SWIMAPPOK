import { Skeleton } from '@/components/ui/skeleton';
import { Tier } from '@/constants/pricing-tier';
import { cn } from '@/utils/cn';

interface Props {
  loading: boolean;
  tier: Tier;
  priceMap: Record<string, string>;
  value: string;
  priceSuffix: string;
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  return (
    <div className="mt-6 flex flex-col px-8">
      {loading ? (
        <Skeleton className="h-[96px] w-full bg-border" />
      ) : (
        <>
          <div className={cn('text-[80px] leading-[96px] tracking-[-1.6px] font-medium text-gray-900')}>
            {priceMap[tier.priceId[value]]?.replace(/\.00$/, '') || '$0'}
          </div>
          <div className={cn('font-medium leading-[12px] text-[12px] text-gray-600')}>{priceSuffix}</div>
        </>
      )}
    </div>
  );
}
