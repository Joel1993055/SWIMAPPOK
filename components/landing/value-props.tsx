'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react';

const valueProps = [
  {
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description:
      'Gráficos interactivos y métricas detalladas para analizar tu progreso semana a semana.',
    badge: 'Data-Driven',
    color: 'text-blue-600',
  },
  {
    icon: Target,
    title: 'Objetivos Personalizados',
    description:
      'Define y rastrea tus metas de entrenamiento con alertas y recordatorios inteligentes.',
    badge: 'Smart Goals',
    color: 'text-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Progreso Visual',
    description:
      'Visualiza tu evolución con gráficos de tendencias y comparativas temporales.',
    badge: 'Progress Tracking',
    color: 'text-purple-600',
  },
  {
    icon: Zap,
    title: 'Rendimiento en Tiempo Real',
    description:
      'Monitorea tu rendimiento actual y compara con sesiones anteriores instantáneamente.',
    badge: 'Real-time',
    color: 'text-orange-600',
  },
];

export default function ValuePropsSection() {
  return (
    <section className='w-full'>
      <div className='text-center mb-20'>
        <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
          ¿Por qué elegir Swim APP?
        </h2>
        <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
          Herramientas profesionales diseñadas específicamente para nadadores
          que quieren llevar su entrenamiento al siguiente nivel.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {valueProps.map((prop, index) => (
          <Card
            key={index}
            className='group hover:shadow-lg transition-all duration-300'
          >
            <CardHeader className='text-center pb-4'>
              <div className='mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                <prop.icon className={`w-6 h-6 ${prop.color}`} />
              </div>
              <Badge variant='secondary' className='mb-2'>
                {prop.badge}
              </Badge>
              <CardTitle className='text-lg'>{prop.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-center text-sm leading-relaxed'>
                {prop.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
