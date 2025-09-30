import { Tier } from '@/constants/pricing-tier';
import { CircleCheck } from 'lucide-react';

interface Props {
  tier: Tier;
}

export function FeaturesList({ tier }: Props) {
  return (
    <ul className={'p-8 flex flex-col gap-4'}>
      {tier.features.map((feature: string) => (
        <li key={feature} className="flex gap-x-3">
          <CircleCheck className={'h-6 w-6 text-gray-600'} />
          <span className={'text-base text-gray-700'}>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
