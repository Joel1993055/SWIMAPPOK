import { BarChart3, Calendar, Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    title: 'Performance Analytics',
    description: 'Track swimmer progress with detailed metrics.',
    content: {
      title: 'Advanced Performance Analytics',
      description: `Monitor every swimmer's progress with comprehensive analytics. Track times, distances, heart rate, and stroke efficiency with intuitive charts and visualizations.`,
      image: '/images/homepage/features-tabs/1.webp',
      button: {
        href: '/features/analytics',
        text: 'Learn more',
      },
    },
    icon: BarChart3,
  },
  {
    title: 'Training Sessions',
    description: 'Plan and manage training sessions.',
    content: {
      title: 'Comprehensive Training Management',
      description:
        'Create detailed training sessions with drills, intervals, and goals. Track attendance, monitor performance, and adjust workouts based on real-time data.',
      image: '/images/homepage/features-tabs/2.webp',
      button: {
        href: '/features/training',
        text: 'Learn more',
      },
    },
    icon: Calendar,
  },
  {
    title: 'Team Management',
    description: 'Manage swimmers and coaching staff.',
    content: {
      title: 'Complete Team Management',
      description:
        'Organize swimmers by groups, levels, and competitions. Manage coaching staff, assign roles, and coordinate schedules for optimal team performance.',
      image: '/images/homepage/features-tabs/3.webp',
      button: {
        href: '/features/teams',
        text: 'Learn more',
      },
    },
    icon: Users,
  },
  {
    title: 'Competition Tracking',
    description: 'Monitor competitions and achievements.',
    content: {
      title: 'Competition & Achievement Tracking',
      description:
        'Track competitions, record results, and celebrate achievements. Generate performance reports and share insights with swimmers, parents, and stakeholders.',
      image: '/images/homepage/features-tabs/4.webp',
      button: {
        href: '/features/competitions',
        text: 'Learn more',
      },
    },
    icon: Trophy,
  },
];

export const AspectTabs = () => {
  return (
    <section id="aspect-tabs" className="bg-obsidian px-2.5 lg:px-0">
      <div className="border-r-dark-gray border-l-dark-gray border-b-dark-gray container border-x border-b px-0">
        {/*  DESKTOP  */}
        <Tabs
          defaultValue={FEATURES[0].title}
          orientation="horizontal"
          className="hidden lg:flex lg:flex-col"
        >
          <TabsList className="bg-jet border-b-dark-gray flex items-start justify-start overflow-x-auto rounded-none border-b p-0 lg:basis-1/4">
            {FEATURES.map((feature) => (
              <TabsTrigger
                key={feature.title}
                value={feature.title}
                className={cn(
                  'text-foreground h-full min-h-36 w-full min-w-[200px] flex-1 items-start justify-start rounded-none px-4 py-3 text-start whitespace-normal transition-colors duration-300',
                  'border-r-dark-gray border-r last:border-none',
                  'data-[state=active]:text-foreground data-[state=active]:bg-secondary data-[state=active]:shadow-none',
                  'dark:data-[state=active]:text-foreground lg:p-8 dark:text-gray-300',
                )}
              >
                <div className="flex h-full w-full justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="text-foreground mt-2 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <feature.icon className="size-4" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {FEATURES.map((feature) => (
            <TabsContent
              key={feature.title}
              value={feature.title}
              className="bg-obsidian m-0 grid grid-cols-2 overflow-hidden"
            >
              <div className="border-r-dark-gray flex flex-col justify-center gap-4 border-r p-6 lg:p-8">
                <h4 className="text-foreground text-2xl font-semibold lg:text-4xl">
                  {feature.content.title}
                </h4>
                <p className="text-mid-gray">{feature.content.description}</p>
                <div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={feature.content.button.href}>
                      {feature.content.button.text}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex h-[235px] items-center justify-center p-8 md:h-[434px]">
                <div className="bg-overlay-gray rounded-sm p-2 sm:p-3 md:p-4 lg:flex-1">
                  <div className="relative aspect-[501/351] w-full overflow-hidden rounded-sm p-4">
                    <Image
                      src={feature.content.image}
                      alt={feature.title}
                      fill
                      className="rounded-sm object-cover"
                    />
                  </div>
                </div>
                <div className="group pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center self-start">
                  <Image
                    src="/images/homepage/features-tabs/bg-small.webp"
                    alt={`tabs background`}
                    fill
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/*  MOBILE  */}
        <div className="block lg:hidden">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-obsidian m-0 overflow-hidden"
            >
              <div className="border-b-dark-gray flex flex-col justify-center gap-4 border-b px-6 py-12">
                <h4 className="text-foreground text-2xl font-semibold lg:text-4xl">
                  {feature.content.title}
                </h4>
                <p className="text-mid-gray">{feature.content.description}</p>
                <div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={feature.content.button.href}>
                      {feature.content.button.text}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="border-b-dark-gray relative flex h-auto items-center justify-center border-b p-6">
                <div className="bg-overlay-gray flex-1 rounded-sm p-2 sm:p-3 md:p-4">
                  <div className="relative aspect-[501/351] w-full overflow-hidden rounded-sm p-4">
                    <Image
                      src={feature.content.image}
                      alt={feature.title}
                      fill
                      className="rounded-sm object-cover"
                    />
                  </div>
                </div>
                <div className="group pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center self-start">
                  <Image
                    src="/images/homepage/features-tabs/bg-small.webp"
                    alt={`tabs background`}
                    fill
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
