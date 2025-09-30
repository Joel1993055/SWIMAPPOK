import { Button } from '@/components/ui/button';
import { IBillingFrequency } from '@/constants/billing-frequency';
import { PricingTier } from '@/constants/pricing-tier';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  loading: boolean;
  frequency: IBillingFrequency;
  priceMap: Record<string, string>;
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
  return (
    <div className="isolate mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-50 max-w-6xl">
      {PricingTier.map((tier) => (
        <div 
          key={tier.id} 
          className={cn(
            'relative rounded-xl overflow-hidden transition-all duration-300 z-50',
            tier.featured 
              ? 'bg-gray-900/40 backdrop-blur-sm border border-yellow-400/20 shadow-lg shadow-yellow-400/10' 
              : 'bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-900/40'
          )}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  tier.featured ? 'bg-yellow-400/20' : 'bg-gray-700/50'
                )}>
                  <Image src={tier.icon} height={24} width={24} alt={tier.name} className="filter brightness-0 invert" />
                </div>
                <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              {loading ? (
                <div className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
              ) : (
                <>
                  <div className="text-5xl font-bold text-white mb-1">
                    {priceMap[tier.priceId[frequency.value]]?.replace(/\.00$/, '') || '$0'}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{frequency.priceSuffix}</div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Button 
              className={cn(
                'w-full py-2.5 text-sm font-medium transition-all duration-200',
                tier.featured 
                  ? 'bg-yellow-400/90 hover:bg-yellow-400 text-gray-900 shadow-sm hover:shadow-md' 
                  : 'bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 hover:border-gray-500/50'
              )}
              asChild={true}
            >
              <Link href={`/checkout/${tier.priceId[frequency.value]}`}>Get started</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
