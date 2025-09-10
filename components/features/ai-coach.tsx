'use client';

import { useAICoachStore } from '@/lib/store/unified';
// NUEVO: Importar el store unificado
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Bot,
    Brain,
    Settings,
    Sparkles,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface AICoachProps {
  className?: string;
}

export function AICoach({ className }: AICoachProps) {
  // MANTENER: Context existente
  const {
    isEnabled,
    analysis: currentAnalysis,
    toggleAICoach,
    getPersonalizedAdvice,
  } = useAICoachStore();

  // NUEVO: Store unificado
  const { analysis: storeAnalysis, setAnalysis } = useAICoachStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [contextInput, setContextInput] = useState('');

  // NUEVO: Función para mapear AICoachAnalysis del context al store
  const mapContextAnalysisToStore = (contextAnalysis: {
    overallScore: number;
    strengths: string[];
    improvements?: string[];
    recommendations?: Array<{ message?: string } | string>;
  }) => ({
    overallScore: contextAnalysis.overallScore,
    strengths: contextAnalysis.strengths,
    weaknesses: contextAnalysis.improvements || [], // Mapear improvements a weaknesses
    recommendations:
      contextAnalysis.recommendations?.map(rec =>
        typeof rec === 'string' ? rec : rec.message || ''
      ) || [],
  });

  // Ejecutar sincronización cuando cambie el análisis
  React.useEffect(() => {
    if (currentAnalysis && !storeAnalysis) {
      const mappedAnalysis = mapContextAnalysisToStore(currentAnalysis);
      setAnalysis(mappedAnalysis);
    }
  }, [currentAnalysis, storeAnalysis]); // Removido setAnalysis de las dependencias

  const getRecoveryStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs_attention':
        return 'text-yellow-600';
      case 'overreaching':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecoveryStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'needs_attention':
        return 'Necesita atención';
      case 'overreaching':
        return 'Sobreentrenamiento';
      default:
        return 'Desconocido';
    }
  };

  if (!isEnabled) {
    return (
      <Card className={`bg-muted/50 ${className}`}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bot className='h-5 w-5' />
            AI Coach
          </CardTitle>
          <CardDescription>
            Tu entrenador personal inteligente está desactivado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={toggleAICoach} className='w-full gap-2'>
            <Sparkles className='h-4 w-4' />
            Activar AI Coach
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header del AI Coach */}
      <Card className='bg-muted/50'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Bot className='h-5 w-5 text-primary' />
              <CardTitle>AI Coach</CardTitle>
              <Badge variant='secondary' className='gap-1'>
                <Sparkles className='h-3 w-3' />
                Activo
              </Badge>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsExpanded(!isExpanded)}
                className='h-8 w-8 p-0'
              >
                <Settings className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleAICoach}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <CardDescription>
            Análisis inteligente y recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Análisis Actual */}
      {currentAnalysis && (
        <Card className='bg-muted/50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Análisis del Entrenamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center p-4'>
              <div className='text-2xl font-bold text-primary mb-2'>
                {currentAnalysis.overallScore}/100
              </div>
              <div className='text-sm text-muted-foreground'>
                Puntuación General
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consulta Contextual */}
      {isExpanded && (
        <Card className='bg-muted/50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Consulta al AI Coach
            </CardTitle>
            <CardDescription>
              Describe tu situación para recibir consejos personalizados
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <textarea
              value={contextInput}
              onChange={e => setContextInput(e.target.value)}
              placeholder='Ej: Me siento fatigado después del entrenamiento de ayer...'
              className='w-full p-3 border rounded-lg resize-none h-20 text-sm'
            />
            <Button
              onClick={() => {
                const advice = getPersonalizedAdvice(contextInput);
                // Aquí se mostrarían los consejos generados
                console.log('Consejos generados:', advice);
                setContextInput('');
              }}
              className='w-full gap-2'
              disabled={!contextInput.trim()}
            >
              <Sparkles className='h-4 w-4' />
              Obtener Consejo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Estado Inicial */}
      {!currentAnalysis && (
        <Card className='bg-muted/50'>
          <CardContent className='text-center py-8'>
            <Bot className='h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50' />
            <p className='text-muted-foreground mb-4'>
              El AI Coach analizará tu entrenamiento automáticamente
            </p>
            <p className='text-sm text-muted-foreground'>
              Crea un entrenamiento para ver el análisis inteligente
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
