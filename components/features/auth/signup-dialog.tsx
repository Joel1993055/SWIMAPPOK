'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpAction } from '@/lib/actions/auth';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn: () => void;
}

export function SignUpDialog({
  open,
  onOpenChange,
  onSwitchToSignIn,
}: SignUpDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signUpAction(formData);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({
          type: 'success',
          text: result.success || 'Usuario registrado correctamente',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error inesperado. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='h-5 w-5' />
            Crear Cuenta
          </DialogTitle>
          <DialogDescription>
            Crea tu cuenta para comenzar a gestionar tus entrenamientos
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='tu@email.com'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Contraseña</Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='Mínimo 6 caracteres'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Repite tu contraseña'
              required
            />
          </div>

          {/* Mensajes */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToSignIn}
              className='text-primary hover:underline'
            >
              Inicia sesión
            </button>
          </p>
        </div>

        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>
            Al crear una cuenta, aceptas nuestros términos de servicio y
            política de privacidad
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
