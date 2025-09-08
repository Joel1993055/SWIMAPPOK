'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormValidation } from '@/lib/hooks/use-validation';
import { SessionFormData, sessionSchema } from '@/lib/validations/schemas';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

// =====================================================
// TIPOS
// =====================================================

interface SessionFormProps {
  initialData?: Partial<SessionFormData>;
  onSubmit: (data: SessionFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function SessionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = 'Create Session',
  cancelText = 'Cancel',
}: SessionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    errors,
    isValid,
    isDirty,
    setField,
    handleSubmit,
    getFieldError,
    hasFieldError,
    reset,
  } = useFormValidation(sessionSchema, initialData);

  // =====================================================
  // MANEJADORES
  // =====================================================
  const handleFormSubmit = handleSubmit(async formData => {
    setIsSubmitting(true);
    try {
      // Convertir formData al formato esperado por onSubmit
      const sessionData: SessionFormData = {
        title: formData.name,
        date: formData.date,
        startTime: '',
        distance: formData.distance_meters,
        duration: formData.duration_minutes,
        rpe: formData.rpe,
        description: '',
        endTime: '',
        location: '',
        notes: '',
      };
      await onSubmit(sessionData);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarIcon className='h-5 w-5' />
          {initialData ? 'Edit Session' : 'Create New Session'}
        </CardTitle>
        <CardDescription>
          {initialData
            ? 'Update the session details below'
            : 'Fill in the details to create a new training session'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleFormSubmit} className='space-y-6'>
          {/* ERRORES GENERALES */}
          {errors.general && (
            <Alert variant='destructive'>
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* INFORMACIÓN BÁSICA */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Basic Information</h3>

            {/* Título */}
            <div className='space-y-2'>
              <Label htmlFor='title'>Session Title *</Label>
              <Input
                id='title'
                value={data?.name || ''}
                onChange={e => setField('name', e.target.value)}
                placeholder='e.g., Morning Training Session'
                className={hasFieldError('name') ? 'border-red-500' : ''}
              />
              {hasFieldError('name') && (
                <p className='text-sm text-red-500'>{getFieldError('name')}</p>
              )}
            </div>

            {/* Descripción */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={data?.notes || ''}
                onChange={e => setField('notes', e.target.value)}
                placeholder='Describe the session objectives and activities...'
                rows={3}
                className={hasFieldError('notes') ? 'border-red-500' : ''}
              />
              {hasFieldError('notes') && (
                <p className='text-sm text-red-500'>{getFieldError('notes')}</p>
              )}
            </div>
          </div>

          {/* FECHA Y HORA */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Schedule</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Fecha */}
              <div className='space-y-2'>
                <Label htmlFor='date'>Date *</Label>
                <Input
                  id='date'
                  type='date'
                  value={data?.date || ''}
                  onChange={e => setField('date', e.target.value)}
                  className={hasFieldError('date') ? 'border-red-500' : ''}
                />
                {hasFieldError('date') && (
                  <p className='text-sm text-red-500'>
                    {getFieldError('date')}
                  </p>
                )}
              </div>

              {/* Hora de inicio */}
              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time *</Label>
                <Input
                  id='startTime'
                  type='time'
                  value={''}
                  onChange={e => setField('notes', e.target.value)}
                  className={hasFieldError('notes') ? 'border-red-500' : ''}
                />
                {hasFieldError('notes') && (
                  <p className='text-sm text-red-500'>
                    {getFieldError('notes')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DETALLES DE ENTRENAMIENTO */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Training Details</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Distancia */}
              <div className='space-y-2'>
                <Label htmlFor='distance'>Distance (meters) *</Label>
                <Input
                  id='distance'
                  type='number'
                  min='0'
                  step='100'
                  value={data?.distance_meters || ''}
                  onChange={e =>
                    setField('distance', parseInt(e.target.value) || 0)
                  }
                  placeholder='e.g., 2000'
                  className={hasFieldError('distance') ? 'border-red-500' : ''}
                />
                {hasFieldError('distance') && (
                  <p className='text-sm text-red-500'>
                    {getFieldError('distance')}
                  </p>
                )}
              </div>

              {/* Duración */}
              <div className='space-y-2'>
                <Label htmlFor='duration'>Duration (minutes) *</Label>
                <Input
                  id='duration'
                  type='number'
                  min='0'
                  step='5'
                  value={data?.duration_minutes || ''}
                  onChange={e =>
                    setField('duration', parseInt(e.target.value) || 0)
                  }
                  placeholder='e.g., 90'
                  className={hasFieldError('duration') ? 'border-red-500' : ''}
                />
                {hasFieldError('duration') && (
                  <p className='text-sm text-red-500'>
                    {getFieldError('duration')}
                  </p>
                )}
              </div>
            </div>

            {/* RPE */}
            <div className='space-y-2'>
              <Label htmlFor='rpe'>Rate of Perceived Exertion (1-10) *</Label>
              <Select
                value={data?.rpe?.toString() || ''}
                onValueChange={value => setField('rpe', parseInt(value))}
              >
                <SelectTrigger
                  className={hasFieldError('rpe') ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder='Select RPE level' />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} - {getRPEDescription(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFieldError('rpe') && (
                <p className='text-sm text-red-500'>{getFieldError('rpe')}</p>
              )}
            </div>
          </div>

          {/* UBICACIÓN Y NOTAS */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Additional Information</h3>

            {/* Ubicación */}
            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={data?.location || ''}
                onChange={e => setField('location', e.target.value)}
                placeholder='e.g., Olympic Pool, Lane 3'
                className={hasFieldError('location') ? 'border-red-500' : ''}
              />
              {hasFieldError('location') && (
                <p className='text-sm text-red-500'>
                  {getFieldError('location')}
                </p>
              )}
            </div>

            {/* Notas */}
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                value={data?.notes || ''}
                onChange={e => setField('notes', e.target.value)}
                placeholder='Any additional notes about the session...'
                rows={3}
                className={hasFieldError('notes') ? 'border-red-500' : ''}
              />
              {hasFieldError('notes') && (
                <p className='text-sm text-red-500'>{getFieldError('notes')}</p>
              )}
            </div>
          </div>

          {/* BOTONES */}
          <div className='flex justify-end gap-3 pt-4'>
            {onCancel && (
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting || isLoading}
              >
                {cancelText}
              </Button>
            )}

            <Button
              type='submit'
              disabled={!isValid || isSubmitting || isLoading}
              className='min-w-[120px]'
            >
              {isSubmitting || isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  {isSubmitting ? 'Creating...' : 'Loading...'}
                </div>
              ) : (
                submitText
              )}
            </Button>
          </div>

          {/* ESTADO DEL FORMULARIO */}
          {isDirty && (
            <div className='text-sm text-gray-500 text-center'>
              {isValid ? '✅ Form is valid' : '❌ Please fix errors above'}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// =====================================================
// UTILIDADES
// =====================================================

function getRPEDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: 'Very easy',
    2: 'Easy',
    3: 'Moderate',
    4: 'Somewhat hard',
    5: 'Hard',
    6: 'Harder',
    7: 'Very hard',
    8: 'Extremely hard',
    9: 'Maximum effort',
    10: 'Absolute maximum',
  };
  return descriptions[level] || 'Unknown';
}
