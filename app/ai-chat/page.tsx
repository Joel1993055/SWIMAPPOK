'use client';

import { AIChatInterface } from '@/components/features/ai-chat/ai-chat-interface';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
    BookOpen,
    Bot,
    Heart,
    MessageCircle,
    Sparkles,
    Target,
    Trophy,
    Zap
} from 'lucide-react';

export default function AIChatPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <MessageCircle className='h-6 w-6 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>Chat con IA</h1>
              <Badge variant='secondary' className='gap-1'>
                <Sparkles className='h-3 w-3' />
                OpenAI GPT-3.5
              </Badge>
            </div>
            <p className='text-muted-foreground'>
              Tu entrenador personal de natación con inteligencia artificial
            </p>
          </div>

          {/* Layout principal */}
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]'>
            {/* Chat Interface - 75% del ancho */}
            <div className='lg:col-span-3'>
              <AIChatInterface />
            </div>

            {/* Panel lateral - 25% del ancho */}
            <div className='lg:col-span-1 space-y-4'>
              {/* Información del AI */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Bot className='h-5 w-5' />
                    Tu Entrenador IA
                  </CardTitle>
                  <CardDescription>
                    Especialista en natación y ciencias del deporte
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='text-sm text-muted-foreground'>
                    <p>Puedo ayudarte con:</p>
                    <ul className='mt-2 space-y-1'>
                      <li>• Técnica de natación</li>
                      <li>• Training planning</li>
                      <li>• Nutrición deportiva</li>
                      <li>• Prevención de lesiones</li>
                      <li>• Psicología deportiva</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Temas de conversación */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Temas Populares
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='p-2 border rounded-lg bg-background/50'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Target className='h-3 w-3 text-blue-500' />
                      <span className='text-xs font-medium'>Técnica</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Mejora tu crol, espalda, braza...
                    </p>
                  </div>

                  <div className='p-2 border rounded-lg bg-background/50'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Zap className='h-3 w-3 text-yellow-500' />
                      <span className='text-xs font-medium'>Entrenamiento</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Planifica tus sesiones
                    </p>
                  </div>

                  <div className='p-2 border rounded-lg bg-background/50'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Heart className='h-3 w-3 text-red-500' />
                      <span className='text-xs font-medium'>Recovery</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Rest and nutrition
                    </p>
                  </div>

                  <div className='p-2 border rounded-lg bg-background/50'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Trophy className='h-3 w-3 text-green-500' />
                      <span className='text-xs font-medium'>Competition</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Race strategies
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Consejos rápidos */}
              <Card className='bg-muted/50'>
                <CardHeader>
                  <CardTitle className='text-sm'>💡 Consejos Rápidos</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='text-xs text-muted-foreground'>
                    "¿Cómo mejorar mi técnica de crol?"
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    "¿Qué entrenar para 100m libre?"
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    "¿Cómo prevenir lesiones en hombro?"
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    "¿Cuánto descansar entre series?"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
