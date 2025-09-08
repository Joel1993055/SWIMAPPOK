'use client';

import Image from 'next/image';

export default function Demo() {
  return (
    <section
      className='px-12 md:px-24 py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16'
      style={{ backgroundColor: '#0b0b0f' }}
    >
      {/* Columna izquierda - Texto */}
      <div className='flex-1'>
        <h2 className='text-4xl md:text-5xl font-semibold text-white'>
          Everything you need at your fingertips
        </h2>
        <p className='text-gray-400 text-lg max-w-md mt-6'>
          A comprehensive collection of components written in modern React,
          Typescript and Tailwind CSS.
          <br />
          You&apos;ll find here everything you need to build your next landing
          page.
        </p>
      </div>

      {/* Columna derecha - Mockup del móvil */}
      <div className='flex-1 relative flex items-center justify-center'>
        {/* Glow radial azul detrás del móvil */}
        <div
          className='absolute w-[500px] h-[500px] rounded-full blur-3xl'
          style={{
            background:
              'radial-gradient(circle, rgba(29, 78, 216, 0.4) 0%, rgba(30, 64, 175, 0.2) 50%, transparent 100%)',
          }}
        />

        {/* Mockup del iPhone */}
        <div className='relative h-[600px] w-[300px] rounded-[2rem] shadow-2xl overflow-hidden'>
          <Image
            src='/—Pngtree—mobile phone mockup design_6075299.png'
            alt='Mobile app mockup'
            width={300}
            height={600}
            className='object-cover w-full h-full'
          />
        </div>
      </div>
    </section>
  );
}
