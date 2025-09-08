"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormApiValidation } from '@/lib/hooks/use-api-validation'
import { SessionFormData, sessionSchema } from '@/lib/validations/schemas'
import { CheckCircleIcon, LoaderIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function ApiValidationExample() {
  const [sessions, setSessions] = useState<SessionFormData[]>([])
  const [formData, setFormData] = useState<Partial<SessionFormData>>({})

  // =====================================================
  // SIMULACIÓN DE API
  // =====================================================
  const simulateApiCall = async (data: SessionFormData): Promise<SessionFormData> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular error aleatorio (10% de probabilidad)
    if (Math.random() < 0.1) {
      throw new Error('Network error: Failed to create session')
    }
    
    // Simular respuesta exitosa
    return data
  }

  // =====================================================
  // HOOK DE VALIDACIÓN DE API
  // =====================================================
  const {
    data,
    error,
    loading,
    isValid,
    validationErrors,
    handleSubmit,
    reset
  } = useFormApiValidation(
    sessionSchema,
    () => simulateApiCall(formData as SessionFormData),
    {
      onSuccess: () => {
        setSessions(prev => [formData as SessionFormData, ...prev])
        setFormData({})
        reset()
      },
      onError: (error) => {
        console.error('API Error:', error)
      }
    }
  )

  // =====================================================
  // MANEJADORES
  // =====================================================
  const handleFieldChange = (field: keyof SessionFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (Object.keys(formData).length === 0) {
      alert('Please fill in at least one field')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handleSubmit(formData as any)
  }

  const handleReset = () => {
    setFormData({})
    reset()
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Validation Example</h1>
        <p className="text-gray-600">
          This example demonstrates API validation using Zod schemas
        </p>
      </div>

      {/* FORMULARIO */}
      <Card>
        <CardHeader>
          <CardTitle>Create Session with API Validation</CardTitle>
          <CardDescription>
            Fill in the form below. Data will be validated before sending to the API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* ERRORES DE VALIDACIÓN */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <XCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-semibold">Validation Errors:</p>
                    {Object.entries(validationErrors).map(([field, message]) => (
                      <p key={field} className="text-sm">• {field}: {message}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* ERRORES DE API */}
            {error && (
              <Alert variant="destructive">
                <XCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  API Error: {error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* CAMPOS DEL FORMULARIO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Session title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance (meters) *</Label>
                <Input
                  id="distance"
                  type="number"
                  min="0"
                  value={formData.distance || ''}
                  onChange={(e) => handleFieldChange('distance', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.duration || ''}
                  onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rpe">RPE (1-10) *</Label>
                <Input
                  id="rpe"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rpe || ''}
                  onChange={(e) => handleFieldChange('rpe', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 7"
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
              
              <Button
                type="submit"
                disabled={loading || !isValid}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Session'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ESTADO DE VALIDACIÓN */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Status</CardTitle>
          <CardDescription>
            Current validation state and errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                isValid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {isValid ? <CheckCircleIcon className="h-6 w-6" /> : <XCircleIcon className="h-6 w-6" />}
              </div>
              <p className="font-semibold">Form Valid</p>
              <p className="text-sm text-gray-600">{isValid ? 'Yes' : 'No'}</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                loading ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {loading ? <LoaderIcon className="h-6 w-6 animate-spin" /> : <CheckCircleIcon className="h-6 w-6" />}
              </div>
              <p className="font-semibold">Loading</p>
              <p className="text-sm text-gray-600">{loading ? 'Yes' : 'No'}</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {error ? <XCircleIcon className="h-6 w-6" /> : <CheckCircleIcon className="h-6 w-6" />}
              </div>
              <p className="font-semibold">API Error</p>
              <p className="text-sm text-gray-600">{error ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* ERRORES DETALLADOS */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Validation Errors:</h4>
              <div className="space-y-1">
                {Object.entries(validationErrors).map(([field, message]) => (
                  <div key={field} className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {field}
                    </Badge>
                    <span className="text-sm text-red-600">{message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SESIONES CREADAS */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Sessions ({sessions.length})</CardTitle>
            <CardDescription>
              Sessions successfully created through API validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <p className="text-sm text-gray-600">
                        {session.date} at {session.startTime} • {session.distance}m • {session.duration}min • RPE {session.rpe}
                      </p>
                    </div>
                    <Badge variant="outline">Created</Badge>
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
          <CardTitle>API Validation Features</CardTitle>
          <CardDescription>
            This example demonstrates the following features:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Validation:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Client-side validation before API call</li>
                <li>• Real-time validation feedback</li>
                <li>• Detailed error messages</li>
                <li>• Form submission prevention when invalid</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Integration:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Automatic retry on failure</li>
                <li>• Loading states during API calls</li>
                <li>• Error handling and display</li>
                <li>• Success callbacks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
