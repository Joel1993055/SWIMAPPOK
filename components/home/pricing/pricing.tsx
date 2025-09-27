'use client';

import { PriceCards } from '@/components/home/pricing/price-cards';
import { Toggle } from '@/components/shared/toggle';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { useEffect, useState } from 'react';

interface Props {
  country: string;
}

export function Pricing({ country }: Props) {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const [loading, setLoading] = useState(true);
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});

  // Simulate loading prices
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceMap({
        'pri_01hsxyh9txq4rzbrhbyngkhy46': '$10',
        'pri_01hsxycme6m95sejkz7sbz5e9g': '$20',
        'pri_01hsxyeb2bmrg618bzwcwvdd6q': '$16',
        'pri_01hsxyff091kyc9rjzx7zm6yqh': '$40',
        'pri_01hsxyfysbzf90tkh2wqbfxwa5': '$32',
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between z-50">
      <Toggle frequency={frequency} setFrequency={setFrequency} />
      <PriceCards frequency={frequency} loading={loading} priceMap={priceMap} />
    </div>
  );
}
