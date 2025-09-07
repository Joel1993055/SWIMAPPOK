"use client"

import { generateBlurDataURL, generateImageSizes, useLazyImage } from '@/lib/hooks/use-optimized-image'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { forwardRef, useImperativeHandle, useRef } from 'react'

// =====================================================
// TIPOS
// =====================================================

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  lazy?: boolean
  fallback?: React.ReactNode
  onLoad?: () => void
  onError?: (error: Error) => void
  style?: React.CSSProperties
}

interface OptimizedImageRef {
  reload: () => void
  preload: () => void
  reset: () => void
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const OptimizedImage = forwardRef<OptimizedImageRef, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    fill = false,
    className,
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    sizes = '100vw',
    lazy = true,
    fallback,
    onLoad,
    onError,
    style,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    // Usar lazy loading si está habilitado y no es priority
    const shouldUseLazy = lazy && !priority
    
    const lazyImage = useLazyImage(src, {
      quality,
      priority,
      loading: shouldUseLazy ? 'lazy' : 'eager',
      onLoad,
      onError,
      rootMargin: '50px',
      threshold: 0.1
    })

    // Exponer métodos a través de ref
    useImperativeHandle(ref, () => ({
      reload: lazyImage.reload,
      preload: lazyImage.preload,
      reset: lazyImage.reset
    }), [lazyImage])

    // Generar blur data URL si no se proporciona
    const effectiveBlurDataURL = blurDataURL || 
      (placeholder === 'blur' && width && height 
        ? generateBlurDataURL(width, height) 
        : undefined)

    // Mostrar fallback si hay error
    if (lazyImage.error) {
      if (fallback) {
        return <>{fallback}</>
      }
      
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-muted text-muted-foreground rounded",
            className
          )}
          style={{ width, height, ...style }}
        >
          <div className="text-center p-4">
            <div className="text-sm opacity-60">⚠️</div>
            <div className="text-xs mt-1">Failed to load image</div>
          </div>
        </div>
      )
    }

    // Mostrar placeholder mientras carga (solo para lazy loading)
    if (shouldUseLazy && !lazyImage.isInView) {
      return (
        <div
          ref={(el) => {
            if (containerRef.current) containerRef.current = el
            lazyImage.setRef(el)
          }}
          className={cn(
            "bg-muted animate-pulse rounded",
            className
          )}
          style={{ width, height, ...style }}
        />
      )
    }

    // Mostrar loading state
    if (lazyImage.isLoading) {
      return (
        <div 
          className={cn(
            "relative bg-muted animate-pulse rounded overflow-hidden",
            className
          )}
          style={{ width, height, ...style }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden rounded", className)}
        style={style}
      >
        <Image
          src={lazyImage.src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            "transition-all duration-300",
            lazyImage.isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={effectiveBlurDataURL}
          sizes={sizes}
          onLoad={() => {
            lazyImage.preload()
            onLoad?.()
          }}
          onError={(error) => {
            const err = new Error(`Failed to load image: ${src}`)
            onError?.(err)
          }}
          {...props}
        />
      </div>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

// =====================================================
// COMPONENTE PARA GALERÍA
// =====================================================

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
  imageClassName?: string
  columns?: number
  gap?: number
  quality?: number
  lazy?: boolean
}

export function ImageGallery({
  images,
  className,
  imageClassName,
  columns = 3,
  gap = 4,
  quality = 75,
  lazy = true
}: ImageGalleryProps) {
  const sizes = generateImageSizes({
    '640px': Math.floor(640 / columns),
    '768px': Math.floor(768 / columns),
    '1024px': Math.floor(1024 / columns),
    '1280px': Math.floor(1280 / columns),
  })

  return (
    <div 
      className={cn(
        "grid auto-rows-fr",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 0.25}rem`
      }}
    >
      {images.map((image, index) => (
        <div key={`${image.src}-${index}`} className="relative group">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            className={cn(
              "aspect-square object-cover transition-transform group-hover:scale-105",
              imageClassName
            )}
            sizes={sizes}
            quality={quality}
            lazy={lazy}
            priority={index < 6} // Priorizar las primeras 6 imágenes
          />
          
          {image.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// =====================================================
// COMPONENTE PARA AVATAR
// =====================================================

interface OptimizedAvatarProps {
  src: string
  alt: string
  size?: number
  fallback?: string
  className?: string
  quality?: number
}

export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  fallback,
  className,
  quality = 90
}: OptimizedAvatarProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      quality={quality}
      priority={size <= 64} // Priorizar avatares pequeños
      fallback={
        fallback ? (
          <div 
            className={cn(
              "flex items-center justify-center bg-muted text-muted-foreground rounded-full font-medium",
              className
            )}
            style={{ width: size, height: size }}
          >
            {fallback}
          </div>
        ) : undefined
      }
    />
  )
}

// =====================================================
// COMPONENTE PARA HERO IMAGES
// =====================================================

interface HeroImageProps {
  src: string
  alt: string
  className?: string
  overlay?: boolean
  overlayClassName?: string
  children?: React.ReactNode
}

export function HeroImage({
  src,
  alt,
  className,
  overlay = false,
  overlayClassName,
  children
}: HeroImageProps) {
  const sizes = generateImageSizes({
    '640px': 640,
    '768px': 768,
    '1024px': 1024,
    '1280px': 1280,
    '1536px': 1536,
    '1920px': 1920,
  })

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
        quality={85}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={generateBlurDataURL(1920, 1080)}
      />
      
      {overlay && (
        <div className={cn(
          "absolute inset-0 bg-black/20",
          overlayClassName
        )} />
      )}
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
