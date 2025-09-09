import Link from 'next/link';
import { ReactNode } from 'react';


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import { Section } from '../../ui/section';

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = 'Frequently Asked Questions',
  items = [
    {
      question: 'What is SwimApp PRO and how does it help swimmers?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[640px] text-balance'>
            SwimApp PRO is the most advanced swimming analytics platform designed for swimmers of all levels. 
            It provides comprehensive performance tracking, personalized training plans, and detailed analytics 
            to help you improve your swimming technique and achieve your goals.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[640px] text-balance'>
            Whether you're a beginner looking to learn proper technique or an elite athlete seeking to optimize 
            performance, SwimApp PRO offers the tools and insights you need to excel in the water.
          </p>
        </>
      ),
    },
    {
      question: 'Do I need any special equipment to use SwimApp PRO?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[600px]'>
            SwimApp PRO works with most modern smartphones and smartwatches. For basic tracking, you only need 
            your phone to log sessions manually. For advanced analytics, we recommend using a compatible 
            smartwatch or fitness tracker.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[600px]'>
            The app integrates with popular devices like Apple Watch, Garmin, and Fitbit, automatically 
            syncing your swimming data for detailed analysis and insights.
          </p>
        </>
      ),
    },
    {
      question: 'How accurate are the swimming analytics and performance metrics?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Our analytics are powered by advanced algorithms that have been validated by swimming coaches 
            and sports scientists. The platform uses machine learning to provide highly accurate insights 
            into your swimming performance.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            We track over 20 different metrics including stroke rate, stroke length, pace consistency, 
            and efficiency ratios, giving you a complete picture of your swimming technique and progress.
          </p>
        </>
      ),
    },
    {
      question: 'Can SwimApp PRO help me with different swimming strokes?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Absolutely! SwimApp PRO supports all four competitive strokes: freestyle, backstroke, breaststroke, 
            and butterfly. Each stroke has its own specific analytics and training recommendations.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            The app also includes specialized training for individual medley (IM) events and provides 
            stroke-specific drills and technique improvements tailored to your current skill level.
          </p>
        </>
      ),
    },
    {
      question: 'Is my swimming data secure and private?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Yes, your data security and privacy are our top priorities. All your swimming data is encrypted 
            and stored securely using industry-standard security protocols. We never share your personal 
            information with third parties without your explicit consent.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            You have complete control over your data and can export or delete it at any time. For more 
            details, please review our{' '}
            <Link href='/privacy' className='text-foreground underline'>
              Privacy Policy
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      question: 'Does SwimApp PRO work for both pool and open water swimming?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Yes! SwimApp PRO is designed for both pool and open water swimming. The app automatically 
            detects your swimming environment and adjusts the analytics accordingly.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            For open water swimming, we provide specialized features like GPS tracking, current analysis, 
            and weather integration to help you train safely and effectively in natural water conditions.
          </p>
        </>
      ),
    },
    {
      question: 'Can I use SwimApp PRO with my swimming coach?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Absolutely! SwimApp PRO includes coach collaboration features that allow you to share your 
            training data and progress with your coach. They can provide feedback, adjust your training 
            plans, and monitor your development remotely.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            Coaches can access detailed analytics, set training goals, and track your improvement over time, 
            making it easier to provide personalized guidance and support.
          </p>
        </>
      ),
    },
    {
      question: 'What if I have technical issues or need support?',
      answer: (
        <>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            We provide comprehensive support through multiple channels. You can reach our support team via 
            email, live chat, or our community forum. We typically respond within 24 hours.
          </p>
          <p className='text-muted-foreground mb-4 max-w-[580px]'>
            For urgent technical issues, we offer priority support for premium users. You can also check 
            our{' '}
            <Link href='/help' className='text-foreground underline'>
              Help Center
            </Link>
            {' '}for detailed guides and troubleshooting tips.
          </p>
        </>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className='max-w-container mx-auto flex flex-col items-center gap-8'>
        <h2 className='text-center text-3xl font-semibold sm:text-5xl'>
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type='single' collapsible className='w-full max-w-[800px]'>
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
