'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className='w-full flex flex-col gap-16 items-center text-center'>
      {/* Logo y Branding */}
      <div className='flex flex-col items-center gap-6'>
        <div className='flex items-center gap-3'>
          <div className='w-16 h-16 bg-primary rounded-xl flex items-center justify-center'>
            <TrendingUp className='w-10 h-10 text-primary-foreground' />
          </div>
          <h1 className='text-5xl font-bold'>Swim APP</h1>
        </div>
        <Badge variant='secondary' className='text-base px-4 py-2'>
          Swim Training Analytics
        </Badge>
      </div>

      {/* Título y Subtítulo */}
      <div className='max-w-4xl space-y-8'>
        <h1 className='text-6xl lg:text-7xl font-bold leading-tight'>
          Domina tu{' '}
          <span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            entrenamiento
          </span>{' '}
          de natación
        </h1>
        <p className='text-2xl lg:text-3xl text-muted-foreground leading-relaxed'>
          Analiza tu rendimiento, optimiza tu técnica y alcanza tus objetivos
          con datos precisos y visualizaciones profesionales.
        </p>
      </div>

      {/* CTA Principal */}
      <div className='flex flex-col sm:flex-row gap-6'>
        <Button asChild size='lg' className='text-xl px-10 py-7'>
          <Link href='/preview-dashboard'>
            <BarChart3 className='w-6 h-6 mr-3' />
            Ver Dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant='outline'
          size='lg'
          className='text-xl px-10 py-7'
        >
          <Link href='/dashboard-demo'>
            <Target className='w-6 h-6 mr-3' />
            Dashboard Demo
          </Link>
        </Button>
      </div>

      {/* Separador visual */}
      <div className='w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8' />
    </div>
  );
}
