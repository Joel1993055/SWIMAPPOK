import { useCallback, useState } from 'react'
import { z } from 'zod'
import { useApiCall } from './use-api-call'
import { useErrorHandler } from './use-error-handler'

// =====================================================
// TIPOS
// =====================================================

interface ApiValidationOptions<T> {
  schema: z.ZodSchema<T>
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retries?: number
  retryDelay?: number
  timeout?: number
}

interface ApiValidationState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  isValid: boolean
  validationErrors: Record<string, string>
}

interface ApiValidationActions<T> {
  validateAndExecute: (apiCall: () => Promise<unknown>, data: unknown) => Promise<{ data: T | null; error: Error | null }>
  validateData: (data: unknown) => { isValid: boolean; errors: Record<string, string> }
  reset: () => void
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useApiValidation<T>(
  options: ApiValidationOptions<T>
): ApiValidationState<T> & ApiValidationActions<T> {
  const { schema, onSuccess, onError, retries, retryDelay, timeout } = options
  const { captureError } = useErrorHandler()
  const apiCall = useApiCall<T>()

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // =====================================================
  // VALIDACIÓN DE DATOS
  // =====================================================
  const validateData = useCallback((data: unknown): { isValid: boolean; errors: Record<string, string> } => {
    try {
      schema.parse(data)
      setValidationErrors({})
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          errors[path] = err.message
        })
        setValidationErrors(errors)
        return { isValid: false, errors }
      } else {
        const generalError = { general: 'Validation error' }
        setValidationErrors(generalError)
        return { isValid: false, errors: generalError }
      }
    }
  }, [schema])

  // =====================================================
  // VALIDACIÓN Y EJECUCIÓN DE API
  // =====================================================
  const validateAndExecute = useCallback(async (
    apiCall: () => Promise<unknown>,
    data: unknown
  ): Promise<{ data: T | null; error: Error | null }> => {
    // Primero validar los datos
    const validation = validateData(data)
    
    if (!validation.isValid) {
      const error = new Error('Validation failed')
      captureError(error, {
        component: 'useApiValidation',
        action: 'validateAndExecute',
        metadata: { validationErrors: validation.errors }
      })
      
      onError?.(error)
      return { data: null, error }
    }

    // Si la validación es exitosa, ejecutar la API
    try {
      const result = await apiCall.execute(apiCall, {
        retries,
        retryDelay,
        timeout,
        onSuccess: (data) => {
          onSuccess?.(data as T)
        },
        onError: (error) => {
          captureError(error, {
            component: 'useApiValidation',
            action: 'validateAndExecute',
            metadata: { validationErrors: validation.errors }
          })
          onError?.(error)
        }
      })

      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      captureError(err, {
        component: 'useApiValidation',
        action: 'validateAndExecute',
        metadata: { validationErrors: validation.errors }
      })
      
      onError?.(err)
      return { data: null, error: err }
    }
  }, [validateData, apiCall, retries, retryDelay, timeout, onSuccess, onError, captureError])

  // =====================================================
  // RESET
  // =====================================================
  const reset = useCallback(() => {
    apiCall.reset()
    setValidationErrors({})
  }, [apiCall])

  // =====================================================
  // CALCULAR VALIDEZ
  // =====================================================
  const isValid = Object.keys(validationErrors).length === 0

  return {
    data: apiCall.data,
    error: apiCall.error,
    loading: apiCall.loading,
    isValid,
    validationErrors,
    validateAndExecute,
    validateData,
    reset,
  }
}

// =====================================================
// HOOK PARA VALIDACIÓN DE FORMULARIOS CON API
// =====================================================

export function useFormApiValidation<T>(
  schema: z.ZodSchema<T>,
  apiCall: () => Promise<unknown>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    retries?: number
    retryDelay?: number
    timeout?: number
  }
) {
  const validation = useApiValidation({
    schema,
    ...options
  })

  const handleSubmit = useCallback(async (data: T) => {
    return await validation.validateAndExecute(apiCall, data)
  }, [validation, apiCall])

  return {
    ...validation,
    handleSubmit,
  }
}

// =====================================================
// HOOK PARA VALIDACIÓN DE MÚLTIPLES SCHEMAS
// =====================================================

export function useMultiSchemaValidation<T extends Record<string, any>>(
  schemas: Record<keyof T, z.ZodSchema<any>>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})
  const [isValid, setIsValid] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const validateField = useCallback((field: keyof T, data: any) => {
    const schema = schemas[field]
    if (!schema) return { isValid: true, errors: {} }

    try {
      schema.parse(data)
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
      setIsValid(prev => ({ ...prev, [field]: true }))
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          fieldErrors[path] = err.message
        })
        
        setErrors(prev => ({
          ...prev,
          [field as string]: fieldErrors
        }))
        setIsValid(prev => ({ ...prev, [field]: false }))
        return { isValid: false, errors: fieldErrors }
      }
      return { isValid: false, errors: { general: 'Validation error' } }
    }
  }, [schemas])

  const validateAll = useCallback((data: T) => {
    const results: Record<keyof T, { isValid: boolean; errors: Record<string, string> }> = {} as any
    let allValid = true

    Object.keys(schemas).forEach((field) => {
      const result = validateField(field as keyof T, data[field as keyof T])
      results[field as keyof T] = result
      if (!result.isValid) allValid = false
    })

    return { isValid: allValid, results }
  }, [schemas, validateField])

  const getFieldErrors = useCallback((field: keyof T) => {
    return errors[field as string] || {}
  }, [errors])

  const hasFieldError = useCallback((field: keyof T) => {
    return !isValid[field]
  }, [isValid])

  return {
    errors,
    isValid,
    validateField,
    validateAll,
    getFieldErrors,
    hasFieldError,
  }
}

// =====================================================
// UTILIDADES DE VALIDACIÓN
// =====================================================

export function createApiValidationSchema<T>(
  schema: z.ZodSchema<T>
): z.ZodSchema<T> {
  return schema
}

export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  response: unknown
): T {
  try {
    return schema.parse(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`API response validation failed: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export function createValidationMiddleware<T>(
  schema: z.ZodSchema<T>
) {
  return (data: unknown): T => {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation middleware failed: ${error.errors.map(e => e.message).join(', ')}`)
      }
      throw error
    }
  }
}
