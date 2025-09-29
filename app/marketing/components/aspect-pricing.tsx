'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    monthlyPrice: '€0',
    annualPrice: '€0',
    features: [
      'Up to 10 swimmers',
      'Basic analytics',
      '1 team',
      'Basic training sessions',
    ],
    cta: 'Get started',
  },
  {
    name: 'DECKapp Pro',
    monthlyPrice: '€6',
    annualPrice: '€60',
    monthlyPerUnit: 'per month',
    annualPerUnit: 'per year',
    features: [
      'Unlimited swimmers',
      'Advanced analytics',
      'Unlimited teams',
      'Advanced training sessions',
      'Competition tracking',
      'Team management',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: '€99',
    annualPrice: '€990',
    monthlyPerUnit: 'per month',
    annualPerUnit: 'per year',
    features: [
      'All Pro features',
      'Custom integrations',
      'Priority support',
      'Advanced reporting',
      'Multi-club management',
      'API access',
    ],
    cta: 'Contact Sales',
  },
];

const AspectPricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="aspect-pricing"
      className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0"
    >
      <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray relative container border px-0">
        <div className="px-6 py-8 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center justify-center gap-4 lg:gap-6">
            <h1 className="text-foreground text-3xl tracking-tight">Pricing</h1>
            <p className="text-mid-gray text-base">
              Choose the plan that fits your swimming club needs
            </p>
            <div className="flex items-center gap-2">
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                aria-label="Toggle annual vs. monthly billing"
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white [&>span]:bg-black [&>span]:data-[state=checked]:bg-black"
                suppressHydrationWarning
              />
              <span className="text-foreground text-sm font-medium">
                {isAnnual ? 'Billed annually (Save 20%)' : 'Billed monthly'}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t-dark-gray grid border-t sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative p-3',
                'border-b-dark-gray border-b last:border-b-0',
                'sm:border-b-0',
                'sm:[&:nth-child(-n+2)]:border-b-dark-gray sm:[&:nth-child(-n+2)]:border-b',
                'sm:odd:border-r-dark-gray sm:odd:border-r',
                'lg:!border-b-0',
                'lg:border-r-dark-gray lg:border-r',
                'lg:[&:nth-child(3n)]:border-r-0',
                'lg:last:!border-r-0',
                plan.popular && '',
              )}
            >
              {plan.popular && (
                <div className="pointer-events-none absolute inset-0 z-0">
                  <Image
                    src="/images/homepage/pricing/pricing-background.webp"
                    alt="Popular plan background"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <Card
                className={cn(
                  'border-dark-gray h-full rounded-lg border bg-transparent',
                  plan.popular && 'bg-transparent',
                )}
              >
                <CardHeader>
                  <h3 className="text-foreground text-2xl font-semibold">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <p className="text-foreground text-lg font-medium">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      {(plan.monthlyPerUnit || plan.annualPerUnit) &&
                        ' ' +
                          (isAnnual ? plan.annualPerUnit : plan.monthlyPerUnit)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-6">
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className="text-foreground size-4 shrink-0" />
                        <span className="text-foreground text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AspectPricing;
