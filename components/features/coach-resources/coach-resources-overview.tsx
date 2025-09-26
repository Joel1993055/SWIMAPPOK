'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Target, TrendingUp } from 'lucide-react';

export function CoachResourcesOverview() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Training Methodologies</h1>
        <p className='text-muted-foreground'>
          Periodization and planning systems for swimming
        </p>
      </div>

      {/* Methodologies */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Traditional Periodization */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Traditional Periodization
            </CardTitle>
            <CardDescription>
              Classic Matveev Model (1964)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>1. General Preparation (4–6 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Development of aerobic base and general technique
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>2. Specific Preparation (6–8 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Adaptation to the specific demands of competition
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>3. Competitive (2–3 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Tapering and fine-tuning
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>4. Transition (2–4 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Active recovery and preparation for the next cycle
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Periodization */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Block Periodization
            </CardTitle>
            <CardDescription>
              Issurin Model (2008)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>1. Accumulation Block (2–3 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  High volume, low intensity, development of capacities
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>2. Transformation Block (2–3 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Medium volume, high intensity, conversion of capacities
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>3. Realization Block (1–2 weeks)</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Low volume, maximum intensity, peaking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ATR Periodization */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5' />
              ATR Periodization
            </CardTitle>
            <CardDescription>
              Bondarchuk Model (1986)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>A – Accumulation</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Development of basic physical capacities
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>T – Transformation</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Conversion of capacities into specific performance
                </p>
              </div>

              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>R – Realization</h4>
                <p className='text-sm text-muted-foreground mt-1'>
                  Maximum expression of performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conjugate Periodization */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Conjugate Periodization
            </CardTitle>
            <CardDescription>
              Verkhoshansky Model (1985)
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='p-3 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold'>Characteristics:</h4>
                <ul className='text-sm text-muted-foreground mt-1 space-y-1'>
                  <li>• Simultaneous development of capacities</li>
                  <li>• Constant variation of stimuli</li>
                  <li>• Prevention of adaptation</li>
                  <li>• Ideal for experienced athletes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
