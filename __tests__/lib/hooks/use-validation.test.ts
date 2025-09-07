import { useFormValidation, useRealtimeValidation, useValidation } from '@/lib/hooks/use-validation'
import { sessionFormSchema } from '@/lib/validations/schemas'
import { act, renderHook } from '@testing-library/react'

// =====================================================
// MOCKS
// =====================================================

// Mock de setTimeout para tests de debounce
jest.useFakeTimers()

// =====================================================
// TESTS PARA useValidation
// =====================================================

describe('useValidation', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    expect(result.current.data).toBeNull()
    expect(result.current.errors).toEqual({})
    expect(result.current.isValid).toBe(false)
    expect(result.current.isDirty).toBe(false)
  })

  it('should initialize with provided data', () => {
    const initialData = {
      title: 'Test Session',
      date: '2024-01-01',
      startTime: '10:00',
      distance: 1000,
      duration: 60,
      rpe: 7
    }
    
    const { result } = renderHook(() => useValidation(sessionFormSchema, initialData))
    
    expect(result.current.data).toEqual(initialData)
    expect(result.current.isDirty).toBe(false)
  })

  it('should validate data correctly', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    const validData = {
      title: 'Test Session',
      date: '2024-01-01',
      startTime: '10:00',
      distance: 1000,
      duration: 60,
      rpe: 7
    }
    
    act(() => {
      result.current.setData(validData)
    })
    
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isValid).toBe(true)
    expect(result.current.errors).toEqual({})
  })

  it('should detect validation errors', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    const invalidData = {
      title: '', // Invalid: empty string
      date: 'invalid-date', // Invalid: not a valid date
      startTime: '25:00', // Invalid: not a valid time
      distance: -100, // Invalid: negative distance
      duration: -5, // Invalid: negative duration
      rpe: 15 // Invalid: RPE out of range
    }
    
    act(() => {
      result.current.setData(invalidData)
    })
    
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isValid).toBe(false)
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
  })

  it('should validate individual fields', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    act(() => {
      result.current.setData({
        title: 'Test Session',
        date: '2024-01-01',
        startTime: '10:00',
        distance: 1000,
        duration: 60,
        rpe: 7
      })
    })
    
    // Valid field
    act(() => {
      const isValid = result.current.validateField('title')
      expect(isValid).toBe(true)
    })
    
    // Invalid field
    act(() => {
      result.current.setField('rpe', 15)
    })
    
    act(() => {
      const isValid = result.current.validateField('rpe')
      expect(isValid).toBe(false)
    })
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    act(() => {
      result.current.setData({
        title: 'Test Session',
        date: '2024-01-01',
        startTime: '10:00',
        distance: 1000,
        duration: 60,
        rpe: 7
      })
    })
    
    expect(result.current.isDirty).toBe(true)
    expect(result.current.data).not.toBeNull()
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.data).toBeNull()
    expect(result.current.errors).toEqual({})
    expect(result.current.isDirty).toBe(false)
  })
})

// =====================================================
// TESTS PARA useFormValidation
// =====================================================

describe('useFormValidation', () => {
  it('should provide form-specific methods', () => {
    const { result } = renderHook(() => useFormValidation(sessionFormSchema))
    
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.handleFieldChange).toBe('function')
    expect(typeof result.current.getFieldError).toBe('function')
    expect(typeof result.current.hasFieldError).toBe('function')
  })

  it('should handle form submission', () => {
    const { result } = renderHook(() => useFormValidation(sessionFormSchema))
    const mockOnSubmit = jest.fn()
    
    const validData = {
      title: 'Test Session',
      date: '2024-01-01',
      startTime: '10:00',
      distance: 1000,
      duration: 60,
      rpe: 7
    }
    
    act(() => {
      result.current.setData(validData)
    })
    
    act(() => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit)
      const mockEvent = { preventDefault: jest.fn() } as any
      handleSubmit(mockEvent)
    })
    
    expect(mockOnSubmit).toHaveBeenCalledWith(validData)
  })

  it('should prevent form submission when invalid', () => {
    const { result } = renderHook(() => useFormValidation(sessionFormSchema))
    const mockOnSubmit = jest.fn()
    
    const invalidData = {
      title: '', // Invalid
      date: '2024-01-01',
      startTime: '10:00',
      distance: 1000,
      duration: 60,
      rpe: 7
    }
    
    act(() => {
      result.current.setData(invalidData)
    })
    
    act(() => {
      const handleSubmit = result.current.handleSubmit(mockOnSubmit)
      const mockEvent = { preventDefault: jest.fn() } as any
      handleSubmit(mockEvent)
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should provide field error information', () => {
    const { result } = renderHook(() => useFormValidation(sessionFormSchema))
    
    const invalidData = {
      title: '', // Invalid
      date: '2024-01-01',
      startTime: '10:00',
      distance: 1000,
      duration: 60,
      rpe: 7
    }
    
    act(() => {
      result.current.setData(invalidData)
    })
    
    // Wait for validation to complete
    act(() => {
      result.current.validate()
    })
    
    expect(result.current.hasFieldError('title')).toBe(true)
    expect(result.current.getFieldError('title')).toBeTruthy()
    expect(result.current.hasFieldError('date')).toBe(false)
    expect(result.current.getFieldError('date')).toBe('')
  })
})

// =====================================================
// TESTS PARA useRealtimeValidation
// =====================================================

describe('useRealtimeValidation', () => {
  it('should debounce validation', () => {
    const { result } = renderHook(() => useRealtimeValidation(sessionFormSchema, undefined, 100))
    
    act(() => {
      result.current.setField('title', 'Test')
    })
    
    // Validation should not happen immediately
    expect(result.current.errors).toEqual({})
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    // Now validation should have happened
    expect(result.current.isValid).toBe(true)
  })

  it('should cleanup timers on unmount', () => {
    const { result, unmount } = renderHook(() => useRealtimeValidation(sessionFormSchema))
    
    act(() => {
      result.current.setField('title', 'Test')
    })
    
    // Unmount before timer completes
    unmount()
    
    // Fast-forward time - should not cause errors
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // No errors should be thrown
    expect(true).toBe(true)
  })
})

// =====================================================
// TESTS DE INTEGRACIÓN
// =====================================================

describe('Integration Tests', () => {
  it('should work with complex validation scenarios', () => {
    const { result } = renderHook(() => useValidation(sessionFormSchema))
    
    // Start with invalid data
    act(() => {
      result.current.setData({
        title: '',
        date: 'invalid',
        startTime: '25:00',
        distance: -100,
        duration: -5,
        rpe: 15
      })
    })
    
    expect(result.current.isValid).toBe(false)
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
    
    // Fix one field at a time
    act(() => {
      result.current.setField('title', 'Valid Title')
      result.current.setField('date', '2024-01-01')
      result.current.setField('startTime', '10:00')
      result.current.setField('distance', 1000)
      result.current.setField('duration', 60)
      result.current.setField('rpe', 7)
    })
    
    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // Validate manually to ensure all fields are checked
    act(() => {
      result.current.validate()
    })
    
    expect(result.current.isValid).toBe(true)
    expect(result.current.errors).toEqual({})
  })
})

// =====================================================
// CLEANUP
// =====================================================

afterEach(() => {
  jest.clearAllTimers()
})
