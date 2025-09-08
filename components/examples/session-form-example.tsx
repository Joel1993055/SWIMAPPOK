'use client';

import SessionForm from '@/components/forms/session-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SessionFormData } from '@/lib/validations/schemas';
import { CheckCircleIcon, PlusIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function SessionFormExample() {
  const [sessions, setSessions] = useState<SessionFormData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionFormData | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // =====================================================
  // MANEJADORES
  // =====================================================
  const handleCreateSession = async (data: SessionFormData) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSession = {
        ...data,
        id: Date.now().toString(), // ID temporal
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSessions(prev => [newSession, ...prev]);
      setShowForm(false);
      setMessage({ type: 'success', text: 'Session created successfully!' });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to create session. Please try again.',
      });
    }
  };

  const handleEditSession = async (data: SessionFormData) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSessions(prev =>
        prev.map((session, index) =>
          session === editingSession
            ? {
                ...data,
                id: `session-${index}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      );

      setEditingSession(null);
      setMessage({ type: 'success', text: 'Session updated successfully!' });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update session. Please try again.',
      });
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev =>
      prev.filter((_, index) => index !== parseInt(sessionId))
    );
    setMessage({ type: 'success', text: 'Session deleted successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (session: SessionFormData) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* HEADER */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-2'>Session Form Example</h1>
        <p className='text-gray-600'>
          This example demonstrates form validation using Zod schemas
        </p>
      </div>

      {/* MENSAJES */}
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertDescription className='flex items-center gap-2'>
            {message.type === 'success' ? (
              <CheckCircleIcon className='h-4 w-4' />
            ) : (
              <XCircleIcon className='h-4 w-4' />
            )}
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* BOTÓN PARA CREAR NUEVA SESIÓN */}
      {!showForm && (
        <div className='flex justify-center'>
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2'
          >
            <PlusIcon className='h-4 w-4' />
            Create New Session
          </Button>
        </div>
      )}

      {/* FORMULARIO */}
      {showForm && (
        <SessionForm
          initialData={editingSession || undefined}
          onSubmit={editingSession ? handleEditSession : handleCreateSession}
          onCancel={handleCancel}
          submitText={editingSession ? 'Update Session' : 'Create Session'}
          cancelText='Cancel'
        />
      )}

      {/* LISTA DE SESIONES */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Sessions ({sessions.length})</CardTitle>
            <CardDescription>
              Sessions created using the validated form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg'>{session.title}</h3>
                      <p className='text-gray-600 text-sm mb-2'>
                        {session.description}
                      </p>

                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                        <div>
                          <span className='font-medium'>Date:</span>
                          <p className='text-gray-600'>{session.date}</p>
                        </div>
                        <div>
                          <span className='font-medium'>Time:</span>
                          <p className='text-gray-600'>{session.startTime}</p>
                        </div>
                        <div>
                          <span className='font-medium'>Distance:</span>
                          <p className='text-gray-600'>{session.distance}m</p>
                        </div>
                        <div>
                          <span className='font-medium'>Duration:</span>
                          <p className='text-gray-600'>{session.duration}min</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-4 mt-2'>
                        <Badge variant='outline'>RPE: {session.rpe}/10</Badge>
                        {session.location && (
                          <Badge variant='secondary'>
                            📍 {session.location}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className='flex gap-2 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(session)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteSession(index.toString())}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* INFORMACIÓN ADICIONAL */}
      <Card>
        <CardHeader>
          <CardTitle>Form Validation Features</CardTitle>
          <CardDescription>
            This form demonstrates the following validation features:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <h4 className='font-semibold mb-2'>Client-side Validation:</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• Required field validation</li>
                <li>• Data type validation (numbers, dates)</li>
                <li>• Range validation (RPE 1-10)</li>
                <li>• Real-time field validation</li>
                <li>• Form submission prevention when invalid</li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-2'>User Experience:</h4>
              <ul className='space-y-1 text-gray-600'>
                <li>• Clear error messages</li>
                <li>• Visual error indicators</li>
                <li>• Loading states during submission</li>
                <li>• Success/error feedback</li>
                <li>• Form reset after successful submission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
