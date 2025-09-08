import { Section } from '../../ui/section';

interface StatItemProps {
  label?: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

interface StatsProps {
  items?: StatItemProps[] | false;
  className?: string;
}

export default function Stats({
  items = [
    {
      label: 'trusted by',
      value: 2.5,
      suffix: 'k',
      description: 'coaches worldwide',
    },
    {
      label: 'over',
      value: 150,
      description: 'swimming clubs using our platform',
    },
    {
      label: 'analyzed',
      value: 50,
      suffix: 'k',
      description: 'training sessions and competitions',
    },
    {
      label: 'includes',
      value: 25,
      description: 'advanced analytics tools',
    },
  ],
  className,
}: StatsProps) {
  return (
    <Section className={className}>
      <div className='container mx-auto max-w-[960px]'>
        {items !== false && items.length > 0 && (
          <div className='grid grid-cols-2 gap-12 sm:grid-cols-4'>
            {items.map((item, index) => (
              <div
                key={index}
                className='flex flex-col items-start gap-3 text-left'
              >
                {item.label && (
                  <div className='text-muted-foreground text-sm font-semibold'>
                    {item.label}
                  </div>
                )}
                <div className='flex items-baseline gap-2'>
                  <div className='text-4xl font-medium text-foreground sm:text-5xl md:text-6xl'>
                    {item.value}
                  </div>
                  {item.suffix && (
                    <div className='text-brand text-2xl font-semibold'>
                      {item.suffix}
                    </div>
                  )}
                </div>
                {item.description && (
                  <div className='text-muted-foreground text-sm font-semibold text-pretty'>
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
