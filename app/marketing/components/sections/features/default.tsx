'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Section } from '../../ui/section';

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: '📑',
      title: 'Choose your sections',
      description:
        'Choose among 100+ components to build a landing page suited to the needs of your product.',
    },
    {
      icon: '✏️',
      title: 'Add your content',
      description:
        'Fill the blanks with screenshots, videos, and other content featuring your product.',
    },
    {
      icon: '⚙️',
      title: 'Customize',
      description:
        'Make design yours in no time by changing the variables that control colors, typography, and other styles.',
    },
  ];

  return (
    <Section className='py-24'>
      {/* Título y subtítulo centrados */}
      <div className='text-center'>
        <h2 className='text-4xl md:text-5xl font-semibold text-foreground'>
          Make the right impression
        </h2>
        <p className='text-muted-foreground text-lg max-w-2xl mx-auto mt-4'>
          Launch UI makes it easy to build an unforgettable website that
          resonates with professional design-centric audiences.
        </p>
      </div>

      {/* Layout en dos columnas */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16'>
        {/* Columna izquierda - Tabs */}
        <div className='space-y-4'>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 flex gap-4 items-start transition cursor-pointer ${
                activeTab === index
                  ? 'bg-muted'
                  : 'bg-transparent hover:bg-muted/20'
              }`}
              onClick={() => setActiveTab(index)}
            >
              <div className='text-2xl'>{tab.icon}</div>
              <div>
                <h3 className='text-foreground font-semibold text-lg mb-2'>
                  {tab.title}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  {tab.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Columna derecha - Dashboard con glow */}
        <div className='relative flex items-center justify-center'>
          {/* Glow radial azul detrás del dashboard */}
          <div
            className='absolute w-[600px] h-[600px] rounded-full blur-3xl'
            style={{
              background:
                'radial-gradient(circle, rgba(29, 78, 216, 0.4) 0%, rgba(30, 64, 175, 0.2) 50%, transparent 100%)',
            }}
          />

          {/* Imagen del dashboard */}
          <div className='relative z-10'>
            <Image
              src='/dashboard-light.png'
              alt='Dashboard preview'
              width={600}
              height={400}
              className='rounded-2xl shadow-2xl'
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
