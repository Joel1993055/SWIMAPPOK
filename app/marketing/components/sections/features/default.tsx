'use client';

import Image from 'next/image';
import { useState } from 'react';

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
    <section className='px-12 md:px-24 py-24 bg-black'>
      {/* Título y subtítulo centrados */}
      <div className='text-center'>
        <h2 className='text-4xl md:text-5xl font-semibold text-white'>
          Make the right impression
        </h2>
        <p className='text-gray-400 text-lg max-w-2xl mx-auto mt-4'>
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
                  ? 'bg-[#141414]'
                  : 'bg-transparent hover:bg-gray-800/20'
              }`}
              onClick={() => setActiveTab(index)}
            >
              <div className='text-2xl'>{tab.icon}</div>
              <div>
                <h3 className='text-white font-semibold text-lg mb-2'>
                  {tab.title}
                </h3>
                <p className='text-gray-400 text-sm'>{tab.description}</p>
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
    </section>
  );
}
