'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useErrorHandler } from '@/core/hooks/use-error-handler';
// Removed demo data seeder imports - simplified onboarding
import { CheckCircle, PlusCircle, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface WelcomeTourProps {
  userId: string;
  onComplete: () => void;
}

export function WelcomeTour({ userId, onComplete }: WelcomeTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const router = useRouter();
  const { captureError } = useErrorHandler();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Swim APP!',
      description: 'La plataforma más avanzada para el análisis de natación. Te ayudaremos a configurar tu cuenta.',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      completed: false
    },
    {
      id: 'demo-data',
      title: 'Datos de Demostración',
      description: '¿Te gustaría que añadamos datos de ejemplo para que puedas explorar todas las funcionalidades?',
      icon: <PlusCircle className="h-8 w-8 text-green-500" />,
      completed: false
    },
    {
      id: 'dashboard',
      title: 'Explora tu Dashboard',
      description: 'Ve a tu dashboard para ver tus métricas, sesiones de entrenamiento y análisis detallados.',
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      completed: false
    }
  ];

  useEffect(() => {
    // Simplified: Always show onboarding for new users
    setIsOpen(true);
  }, [userId, captureError]);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Step 2: Skip demo data - simplified onboarding
      toast.success('¡Bienvenido! Comienza a usar la aplicación.');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 3: Complete onboarding
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(2);
  };

  const handleComplete = () => {
    setIsOpen(false);
    onComplete();
    router.push('/dashboard');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step content */}
          <Card>
            <CardContent className="pt-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Con Swim APP podrás:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Registrar y analizar tus entrenamientos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Ver métricas detalladas de rendimiento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Generar reportes profesionales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Planificar tu temporada de competiciones
                    </li>
                  </ul>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Añadiremos datos de ejemplo que incluyen:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      10 sesiones de entrenamiento realistas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Competiciones programadas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Fases de entrenamiento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Configuración de zonas de entrenamiento
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    Puedes eliminar estos datos en cualquier momento desde la configuración.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ¡Perfecto! Ya tienes todo configurado. Ahora puedes:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Explorar tu dashboard con datos reales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Añadir tus propias sesiones de entrenamiento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Generar reportes y análisis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Configurar tus preferencias
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isLoading}
              >
                Anterior
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              {currentStep === 1 && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Omitir
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : currentStep === 2 ? '¡Empezar!' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
