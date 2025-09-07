import { useCallback, useEffect, useState } from 'react'
import { useErrorHandler } from './use-error-handler'

// =====================================================
// TIPOS
// =====================================================

interface ImageOptimizationOptions {
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  sizes?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: (error: Error) => void
}

interface OptimizedImageState {
  src: string
  isLoading: boolean
  isLoaded: boolean
  error: Error | null
  dimensions?: { width: number; height: number }
}

interface OptimizedImageActions {
  reload: () => void
  preload: () => void
  reset: () => void
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useOptimizedImage(
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): OptimizedImageState & OptimizedImageActions {
  const {
    quality = 75,
    format = 'webp',
    sizes = '100vw',
    priority = false,
    placeholder = 'empty',
    blurDataURL,
    loading = 'lazy',
    onLoad,
    onError
  } = options

  const [state, setState] = useState<OptimizedImageState>({
    src: originalSrc,
    isLoading: false,
    isLoaded: false,
    error: null
  })

  const { captureError } = useErrorHandler()

  // =====================================================
  // GENERAR URL OPTIMIZADA
  // =====================================================
  const generateOptimizedUrl = useCallback((src: string): string => {
    if (!src) return src

    // Si es una URL externa, devolverla tal como está
    if (src.startsWith('http')) {
      return src
    }

    // Para Next.js, usar el Image Optimization API
    const params = new URLSearchParams({
      url: src,
      w: '1920', // Ancho máximo
      q: quality.toString()
    })

    // Agregar formato si es compatible
    if (format && ['webp', 'avif'].includes(format)) {
      params.append('f', format)
    }

    return `/_next/image?${params.toString()}`
  }, [quality, format])

  // =====================================================
  // CARGAR IMAGEN
  // =====================================================
  const loadImage = useCallback(async (src: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const optimizedSrc = generateOptimizedUrl(src)
      
      // Crear una nueva imagen para precargar
      const img = new Image()
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          setState(prev => ({
            ...prev,
            src: optimizedSrc,
            isLoading: false,
            isLoaded: true,
            dimensions: {
              width: img.naturalWidth,
              height: img.naturalHeight
            }
          }))
          onLoad?.()
          resolve()
        }

        img.onerror = (error) => {
          const err = new Error(`Failed to load image: ${src}`)
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: err
          }))
          captureError(err, {
            component: 'useOptimizedImage',
            action: 'loadImage',
            metadata: { src, optimizedSrc }
          })
          onError?.(err)
          reject(err)
        }

        img.src = optimizedSrc
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error loading image')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err
      }))
      captureError(err, {
        component: 'useOptimizedImage',
        action: 'loadImage',
        metadata: { src }
      })
    }
  }, [generateOptimizedUrl, captureError, onLoad, onError])

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    if (originalSrc && (priority || loading === 'eager')) {
      loadImage(originalSrc)
    } else if (originalSrc) {
      setState(prev => ({
        ...prev,
        src: generateOptimizedUrl(originalSrc)
      }))
    }
  }, [originalSrc, priority, loading, loadImage, generateOptimizedUrl])

  // =====================================================
  // ACCIONES
  // =====================================================
  const reload = useCallback(() => {
    if (originalSrc) {
      loadImage(originalSrc)
    }
  }, [originalSrc, loadImage])

  const preload = useCallback(() => {
    if (originalSrc && !state.isLoaded) {
      loadImage(originalSrc)
    }
  }, [originalSrc, state.isLoaded, loadImage])

  const reset = useCallback(() => {
    setState({
      src: originalSrc,
      isLoading: false,
      isLoaded: false,
      error: null
    })
  }, [originalSrc])

  return {
    ...state,
    reload,
    preload,
    reset
  }
}

// =====================================================
// HOOK PARA MÚLTIPLES IMÁGENES
// =====================================================

export function useOptimizedImages(
  sources: string[],
  options: ImageOptimizationOptions = {}
) {
  const [images, setImages] = useState<Record<string, OptimizedImageState>>({})
  const { captureError } = useErrorHandler()

  const loadImages = useCallback(async () => {
    const imageMap: Record<string, OptimizedImageState> = {}

    for (const src of sources) {
      try {
        const img = new Image()
        const optimizedSrc = src.startsWith('http') ? src : `/_next/image?url=${src}&w=1920&q=${options.quality || 75}`
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            imageMap[src] = {
              src: optimizedSrc,
              isLoading: false,
              isLoaded: true,
              error: null,
              dimensions: {
                width: img.naturalWidth,
                height: img.naturalHeight
              }
            }
            resolve()
          }

          img.onerror = () => {
            const error = new Error(`Failed to load image: ${src}`)
            imageMap[src] = {
              src,
              isLoading: false,
              isLoaded: false,
              error
            }
            reject(error)
          }

          img.src = optimizedSrc
        })
      } catch (error) {
        captureError(error instanceof Error ? error : new Error('Failed to load image'), {
          component: 'useOptimizedImages',
          metadata: { src }
        })
        imageMap[src] = {
          src,
          isLoading: false,
          isLoaded: false,
          error: error instanceof Error ? error : new Error('Unknown error')
        }
      }
    }

    setImages(imageMap)
  }, [sources, options.quality, captureError])

  useEffect(() => {
    if (sources.length > 0) {
      loadImages()
    }
  }, [sources, loadImages])

  return {
    images,
    reload: loadImages,
    isLoading: Object.values(images).some(img => img.isLoading),
    hasErrors: Object.values(images).some(img => img.error !== null)
  }
}

// =====================================================
// HOOK PARA LAZY LOADING
// =====================================================

export function useLazyImage(
  src: string,
  options: ImageOptimizationOptions & { rootMargin?: string; threshold?: number } = {}
) {
  const [isInView, setIsInView] = useState(false)
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null)
  const { rootMargin = '50px', threshold = 0.1 } = options

  const optimizedImage = useOptimizedImage(
    src,
    {
      ...options,
      loading: 'lazy'
    }
  )

  useEffect(() => {
    if (!elementRef || !('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(elementRef)

    return () => observer.disconnect()
  }, [elementRef, rootMargin, threshold])

  useEffect(() => {
    if (isInView) {
      optimizedImage.preload()
    }
  }, [isInView, optimizedImage])

  return {
    ...optimizedImage,
    isInView,
    setRef: setElementRef
  }
}

// =====================================================
// UTILIDADES
// =====================================================

export function generateImageSizes(breakpoints: Record<string, number>): string {
  return Object.entries(breakpoints)
    .map(([media, size]) => `(max-width: ${media}) ${size}px`)
    .join(', ')
}

export function generateBlurDataURL(width: number, height: number, color = '#f0f0f0'): string {
  // Crear un SVG simple como placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}