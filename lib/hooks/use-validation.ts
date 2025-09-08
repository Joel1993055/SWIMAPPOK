import { useCallback, useState } from 'react'
import { z } from 'zod'

// =====================================================
// TIPOS
// =====================================================

interface ValidationState<T> {
  data: T | null
  errors: Record<string, string>
  isValid: boolean
  isDirty: boolean
}

interface ValidationActions<T> {
  setData: (data: T) => void
  setField: (field: keyof T, value: unknown) => void
  validate: () => boolean
  validateField: (field: keyof T) => boolean
  reset: () => void
  setErrors: (errors: Record<string, string>) => void
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useValidation<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialData?: Partial<T>
): ValidationState<T> & ValidationActions<T> {
  const [data, setDataState] = useState<T | null>(initialData as T || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  // =====================================================
  // VALIDACIÓN COMPLETA
  // =====================================================
  const validate = useCallback((): boolean => {
    if (!data) {
      setErrors({ general: 'No data to validate' })
      return false
    }

    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ general: 'Validation error' })
      }
      return false
    }
  }, [data, schema])

  // =====================================================
  // VALIDACIÓN DE CAMPO ESPECÍFICO
  // =====================================================
  const validateField = useCallback((field: keyof T): boolean => {
    if (!data) return false

    try {
      // Crear un schema parcial para el campo específico
      const fieldSchema = schema.pick({ [field]: true } as Record<keyof T, true>)
      fieldSchema.parse({ [field]: data[field] })
      
      // Limpiar error del campo
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
      
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(err => err.path[0] === field)
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field as string]: fieldError.message
          }))
        }
      }
      return false
    }
  }, [data, schema])

  // =====================================================
  // ESTABLECER DATOS
  // =====================================================
  const setData = useCallback((newData: T) => {
    setDataState(newData)
    setIsDirty(true)
    // Validar automáticamente los nuevos datos
    try {
      schema.parse(newData)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ general: 'Validation error' })
      }
    }
  }, [schema])

  // =====================================================
  // ESTABLECER CAMPO ESPECÍFICO
  // =====================================================
  const setField = useCallback((field: keyof T, value: unknown) => {
    setDataState(prev => {
      if (!prev) return { [field]: value } as T
      return { ...prev, [field]: value }
    })
    setIsDirty(true)
    
    // Validar el campo automáticamente
    setTimeout(() => validateField(field), 0)
  }, [validateField])

  // =====================================================
  // RESET
  // =====================================================
  const reset = useCallback(() => {
    setDataState(initialData as T || null)
    setErrors({})
    setIsDirty(false)
  }, [initialData])

  // =====================================================
  // ESTABLECER ERRORES MANUALMENTE
  // =====================================================
  const setErrorsManually = useCallback((newErrors: Record<string, string>) => {
    setErrors(newErrors)
  }, [])

  // =====================================================
  // CALCULAR VALIDEZ
  // =====================================================
  const isValid = Object.keys(errors).length === 0 && data !== null

  return {
    data,
    errors,
    isValid,
    isDirty,
    setData,
    setField,
    validate,
    validateField,
    reset,
    setErrors: setErrorsManually,
  }
}

// =====================================================
// HOOK PARA VALIDACIÓN DE FORMULARIOS
// =====================================================

export function useFormValidation<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialData?: Partial<T>
) {
  const validation = useValidation(schema, initialData)
  
  const handleSubmit = useCallback((onSubmit: (data: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault()
      
      if (validation.validate() && validation.data) {
        onSubmit(validation.data)
      }
    }
  }, [validation])

  const handleFieldChange = useCallback((field: keyof T) => {
    return (value: unknown) => {
      validation.setField(field, value)
    }
  }, [validation])

  const getFieldError = useCallback((field: keyof T) => {
    return validation.errors[field as string] || ''
  }, [validation.errors])

  const hasFieldError = useCallback((field: keyof T) => {
    return !!validation.errors[field as string]
  }, [validation.errors])

  return {
    ...validation,
    handleSubmit,
    handleFieldChange,
    getFieldError,
    hasFieldError,
  }
}

// =====================================================
// HOOK PARA VALIDACIÓN EN TIEMPO REAL
// =====================================================

export function useRealtimeValidation<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialData?: Partial<T>,
  debounceMs: number = 300
) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const validation = useValidation(schema, initialData)

  const setFieldWithDebounce = useCallback((field: keyof T, value: unknown) => {
    // Establecer el valor inmediatamente
    validation.setField(field, value)
    
    // Limpiar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    // Establecer nuevo timer para validación
    const newTimer = setTimeout(() => {
      validation.validateField(field)
    }, debounceMs)
    
    setDebounceTimer(newTimer)
  }, [validation, debounceTimer, debounceMs])

  const cleanup = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

  return {
    ...validation,
    setField: setFieldWithDebounce,
    cleanup,
  }
}

// =====================================================
// UTILIDADES DE VALIDACIÓN
// =====================================================

export function createValidationSchema<T extends Record<string, unknown>>(
  fields: Record<keyof T, z.ZodSchema<unknown>>
): z.ZodSchema<T> {
  return z.object(fields as Record<keyof T, z.ZodSchema<unknown>>)
}

export function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const result = schema.parse(data)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
