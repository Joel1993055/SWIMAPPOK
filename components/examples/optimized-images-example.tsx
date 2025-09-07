"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeroImage, ImageGallery, OptimizedAvatar, OptimizedImage } from '@/components/ui/optimized-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOptimizedImages } from '@/lib/hooks/use-optimized-image'
import { useState } from 'react'

// =====================================================
// DATOS DE EJEMPLO
// =====================================================

const sampleImages = [
  {
    src: '/dashboard-light.png',
    alt: 'Dashboard Light Theme',
    caption: 'Light theme dashboard'
  },
  {
    src: '/dashboard-dark.png',
    alt: 'Dashboard Dark Theme', 
    caption: 'Dark theme dashboard'
  },
  {
    src: '/—Pngtree—mobile phone mockup design_6075299.png',
    alt: 'Mobile Mockup',
    caption: 'Mobile app mockup'
  },
]

const avatarSources = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
]

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function OptimizedImagesExample() {
  const [selectedQuality, setSelectedQuality] = useState(75)
  const [showLazyLoading, setShowLazyLoading] = useState(true)

  // Hook para cargar múltiples imágenes
  const { images, reload, isLoading, hasErrors } = useOptimizedImages(
    sampleImages.map(img => img.src),
    { quality: selectedQuality }
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Optimized Images Example</h1>
        <p className="text-gray-600">
          Demonstrating Next.js image optimization, lazy loading, and performance features
        </p>
      </div>

      {/* CONTROLES */}
      <Card>
        <CardHeader>
          <CardTitle>Image Optimization Settings</CardTitle>
          <CardDescription>
            Adjust settings to see how they affect image loading and quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="quality" className="text-sm font-medium">
                Quality:
              </label>
              <select
                id="quality"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(Number(e.target.value))}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value={25}>25% (Low)</option>
                <option value={50}>50% (Medium)</option>
                <option value={75}>75% (High)</option>
                <option value={90}>90% (Very High)</option>
                <option value={100}>100% (Maximum)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lazy"
                checked={showLazyLoading}
                onChange={(e) => setShowLazyLoading(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="lazy" className="text-sm font-medium">
                Enable Lazy Loading
              </label>
            </div>

            <Button onClick={reload} variant="outline" size="sm">
              Reload Images
            </Button>

            <div className="flex gap-2">
              {isLoading && <Badge variant="secondary">Loading...</Badge>}
              {hasErrors && <Badge variant="destructive">Has Errors</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS CON EJEMPLOS */}
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="avatars">Avatars</TabsTrigger>
          <TabsTrigger value="hero">Hero Image</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* SINGLE IMAGE */}
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Single Optimized Image</CardTitle>
              <CardDescription>
                Basic usage with loading states, error handling, and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">With Lazy Loading</h3>
                  <OptimizedImage
                    src="/dashboard-light.png"
                    alt="Dashboard Light"
                    width={400}
                    height={250}
                    quality={selectedQuality}
                    lazy={showLazyLoading}
                    className="rounded-lg border"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">With Priority (No Lazy)</h3>
                  <OptimizedImage
                    src="/dashboard-dark.png"
                    alt="Dashboard Dark"
                    width={400}
                    height={250}
                    quality={selectedQuality}
                    priority
                    lazy={false}
                    className="rounded-lg border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY */}
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>
                Responsive grid with hover effects and captions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={sampleImages}
                columns={3}
                gap={4}
                quality={selectedQuality}
                lazy={showLazyLoading}
                className="mb-4"
              />
              
              <div className="text-sm text-gray-600 mt-4">
                <p>• First 6 images are loaded with priority</p>
                <p>• Responsive grid adapts to screen size</p>
                <p>• Hover effects and captions included</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AVATARS */}
        <TabsContent value="avatars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Avatars</CardTitle>
              <CardDescription>
                Different sizes with fallbacks and high quality for small images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Different Sizes</h3>
                  <div className="flex items-center gap-4">
                    <OptimizedAvatar
                      src={avatarSources[0]}
                      alt="Small Avatar"
                      size={32}
                      fallback="S"
                    />
                    <OptimizedAvatar
                      src={avatarSources[1]}
                      alt="Medium Avatar"
                      size={48}
                      fallback="M"
                    />
                    <OptimizedAvatar
                      src={avatarSources[2]}
                      alt="Large Avatar"
                      size={64}
                      fallback="L"
                    />
                    <OptimizedAvatar
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                      alt="Extra Large Avatar"
                      size={96}
                      fallback="XL"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">With Fallbacks</h3>
                  <div className="flex items-center gap-4">
                    <OptimizedAvatar
                      src="https://invalid-url.jpg"
                      alt="Failed Avatar 1"
                      size={48}
                      fallback="JD"
                    />
                    <OptimizedAvatar
                      src="https://another-invalid-url.jpg"
                      alt="Failed Avatar 2"
                      size={48}
                      fallback="AB"
                    />
                    <OptimizedAvatar
                      src="https://yet-another-invalid-url.jpg"
                      alt="Failed Avatar 3"
                      size={48}
                      fallback="XY"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HERO IMAGE */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Images</CardTitle>
              <CardDescription>
                Full-width images with overlays and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeroImage
                src="/dashboard-light.png"
                alt="Hero Dashboard"
                className="h-64 rounded-lg"
                overlay
                overlayClassName="bg-gradient-to-r from-blue-500/30 to-purple-500/30"
              >
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">Swim APP PRO</h2>
                  <p className="text-lg opacity-90">Advanced Swimming Analytics</p>
                </div>
              </HeroImage>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERFORMANCE */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Information about image loading and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Optimization Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Automatic WebP/AVIF conversion
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Responsive image sizing
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Lazy loading with Intersection Observer
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Blur placeholder generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Error handling and fallbacks
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">✓</Badge>
                      Priority loading for above-fold content
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Current Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <Badge variant="secondary">{selectedQuality}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Lazy Loading:</span>
                      <Badge variant={showLazyLoading ? "default" : "secondary"}>
                        {showLazyLoading ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <Badge variant="outline">WebP/AVIF</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Loading State:</span>
                      <Badge variant={isLoading ? "destructive" : "default"}>
                        {isLoading ? "Loading" : "Ready"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Performance Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use priority={`{true}`} for above-fold images</li>
                  <li>• Set appropriate sizes for responsive images</li>
                  <li>• Use blur placeholders for better UX</li>
                  <li>• Optimize quality based on image content</li>
                  <li>• Enable lazy loading for below-fold images</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
