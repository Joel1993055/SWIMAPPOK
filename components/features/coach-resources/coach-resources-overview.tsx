'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    Calendar,
    Target,
    TrendingUp
} from 'lucide-react';

export function CoachResourcesOverview() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Metodologías de Entrenamiento</h1>
        <p className='text-muted-foreground'>
          Sistemas de periodización y planificación para natación
        </p>
      </div>

      {/* Metodologías */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Periodización Tradicional */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Periodización Tradicional
            </CardTitle>
            <CardDescription>
              Modelo clásico de Matveev (1964)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>1. Preparación General (4-6 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Desarrollo de la base aeróbica y técnica general
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>2. Preparación Específica (6-8 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Adaptación a las demandas específicas de la competición
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>3. Competitiva (2-3 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Afinamiento y puesta a punto
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>4. Transición (2-4 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Recuperación activa y preparación para el siguiente ciclo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Periodización por Bloques */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Periodización por Bloques
            </CardTitle>
            <CardDescription>
              Modelo de Issurin (2008)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>1. Bloque de Acumulación (2-3 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Alto volumen, baja intensidad, desarrollo de capacidades
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>2. Bloque de Transformación (2-3 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Volumen medio, alta intensidad, conversión de capacidades
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>3. Bloque de Realización (1-2 semanas)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Bajo volumen, máxima intensidad, puesta a punto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Periodización ATR */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5' />
              Periodización ATR
            </CardTitle>
            <CardDescription>
              Modelo de Bondarchuk (1986)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>A - Acumulación</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Desarrollo de capacidades físicas básicas
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>T - Transformación</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Conversión de capacidades en rendimiento específico
                </p>
              </div>
              
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>R - Realización</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Expresión máxima del rendimiento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Periodización Conjugada */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Periodización Conjugada
            </CardTitle>
            <CardDescription>
              Modelo de Verkhoshansky (1985)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>Características:</h4>
                <ul className='text-sm text-muted-foreground mt-1 space-y-1'>
                  <li>• Desarrollo simultáneo de capacidades</li>
                  <li>• Variación constante de estímulos</li>
                  <li>• Prevención de adaptación</li>
                  <li>• Ideal para deportistas experimentados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}