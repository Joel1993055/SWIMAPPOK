import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Section } from '../../ui/section';

interface BentoGridItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  href?: string;
}

interface BentoGridProps {
  title?: string;
  description?: string;
  items?: BentoGridItem[];
  className?: string;
}

const defaultItems: BentoGridItem[] = [
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description:
      'Track performance metrics with detailed insights and real-time data visualization.',
    icon: '',
    className: 'col-span-1 md:col-span-2',
  },
  {
    id: 'training',
    title: 'Training Plans',
    description:
      'Personalized workout routines designed by professional swimming coaches.',
    icon: '‍♂️',
    className: 'col-span-1',
  },
  {
    id: 'progress',
    title: 'Progress Tracking',
    description:
      'Monitor your improvement with comprehensive progress reports and milestones.',
    icon: '',
    className: 'col-span-1',
  },
  {
    id: 'community',
    title: 'Community',
    description:
      'Connect with fellow swimmers and share achievements in our vibrant community.',
    icon: '',
    className: 'col-span-1 md:col-span-2',
  },
  {
    id: 'nutrition',
    title: 'Nutrition Guide',
    description:
      'Optimize your performance with tailored nutrition recommendations and meal plans.',
    icon: '',
    className: 'col-span-1',
  },
  {
    id: 'competitions',
    title: 'Competitions',
    description:
      'Participate in virtual competitions and track your ranking against other swimmers.',
    icon: '',
    className: 'col-span-1',
  },
];

export default function BentoGrid({
  title = 'Everything you need to excel',
  description = 'Comprehensive tools and features designed to help you reach your swimming goals faster and more effectively.',
  items = defaultItems,
  className,
}: BentoGridProps) {
  return (
    <Section className={cn('py-24', className)}>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-semibold text-foreground mb-4 sm:text-5xl'>
            {title}
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            {description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {items.map(item => (
            <div
              key={item.id}
              className={cn(
                'group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10',
                item.className
              )}
            >
              {/* Background gradient */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

              {/* Content */}
              <div className='relative z-10'>
                {item.icon && <div className='text-4xl mb-4'>{item.icon}</div>}
                <h3 className='text-xl font-semibold text-card-foreground mb-3'>
                  {item.title}
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  {item.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
