import { ArrowDownUp, BookUser, FileLock2, SmartphoneNfc } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/utils/cn';

const FEATURES = [
  {
    title: 'Detailed Performance Analysis',
    description: `Drill from high-level metrics straight into individual swim times, stroke techniques, and training progress.`,
    icon: BookUser,
  },
  {
    title: 'One-Click Session Management',
    description:
      'Create and manage training sessions in less than ten seconds—no separate tools required.',
    icon: ArrowDownUp,
  },
  {
    title: 'Smart Alerts & Insights',
    description:
      'Set performance thresholds once and get proactive notifications when times improve, goals are reached, or training needs adjustment.',
    icon: SmartphoneNfc,
  },
  {
    title: 'Enterprise-Grade Security',
    description:
      'Advanced data protection with encrypted storage, secure cloud backup, and privacy controls to keep every swimmer\'s performance data—and personal information—completely secure.',
    icon: FileLock2,
  },
];

const AspectDashboard = () => {
  return (
    <section
      id="aspect-dashboard"
      className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0"
    >
      <div className="border-r-dark-gray border-l-dark-gray relative container border px-0">
        <div className="border-b-dark-gray grid grid-cols-1 gap-4 border-b px-6 pt-20 pb-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-32 lg:pb-12">
          <h1 className="text-foreground text-3xl tracking-tight">
            Track Every Stroke, Analyze Every Performance, and Improve with
            Unmatched Precision
          </h1>
          <p className="font-inter-tight text-mid-gray text-base">
            Our unified dashboard brings all your swimmers, training sessions, and
            competitions into a single panoramic view—updated in real time.
          </p>
        </div>
        <div className="relative">
          <div className="group pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center self-start">
            <Image
              src="/images/homepage/dashboard/dashboard-background.webp"
              alt={`hero background`}
              fill
              className="size-full object-cover"
            />
          </div>
          <div className="group pointer-events-none absolute inset-0 z-20 flex size-full flex-col items-center justify-center self-start">
            <Image
              src="/images/homepage/dashboard/dashboard-frontground.webp"
              alt={`hero foreground`}
              fill
              className="size-full object-cover"
            />
          </div>
          <div className="z-10 p-5 lg:p-20">
            <div className="bg-overlay-gray rounded-sm p-2 sm:p-3 md:p-4 lg:rounded-md">
              <div className="relative aspect-video size-full overflow-hidden rounded-sm lg:rounded-md">
                <Image
                  src="/images/homepage/dashboard/dashboard.webp"
                  alt={`Aspect product interface showing connected banks`}
                  fill
                  className="object-contain object-left-top"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-obsidian border-b-dark-gray border-t-dark-gray flex flex-col items-start justify-start overflow-x-auto rounded-none border-t border-b p-0 lg:basis-1/4 lg:flex-row">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={cn(
                'text-foreground h-full min-h-56 w-full items-start justify-start rounded-none px-6 py-12 text-start whitespace-normal lg:p-8',
                'lg:border-r-dark-gray border-b-dark-gray border-b lg:border-r lg:border-b-0 lg:last:border-none',
              )}
            >
              <div className="flex h-full w-full justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-foreground mt-2 text-sm">
                    {feature.description}
                  </p>
                </div>
                <feature.icon className="size-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AspectDashboard;
