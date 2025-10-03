// =====================================================
// ANALYSIS CARD UNIVERSAL - SWIM APP PRO
// =====================================================

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { theme } from '@/configs/theme';
import { cn } from '@/utils/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

// =====================================================
// TIPOS E INTERFACES
// =====================================================

interface AnalysisCardProps {
  // Contenido principal
  title: string;
  description?: string;
  children: React.ReactNode;
  
  // Estilo y layout
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  
  // Elementos opcionales
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  
  // Acciones
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    };
  };
  
  // Estado de carga
  loading?: boolean;
  
  // Métricas destacadas
  metrics?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'positive' | 'negative' | 'neutral';
  }[];
  
  // Zona específica (para cards de zonas)
  zone?: keyof typeof theme.zones;
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export function AnalysisCard({
  title,
  description,
  children,
  className,
  variant = 'default',
  icon: Icon,
  badge,
  actions,
  loading = false,
  metrics,
  zone
}: AnalysisCardProps) {
  
  // =====================================================
  // ESTILOS DINÁMICOS
  // =====================================================
  
  const getCardStyles = () => {
    const baseStyles = theme.components.cards;
    const zoneStyles = zone ? theme.zones[zone] : null;
    
    return cn(
      // Estilos base
      baseStyles.background,
      baseStyles.border,
      baseStyles.shadow,
      baseStyles.radius,
      baseStyles.hover,
      
      // Estilos específicos por variante
      {
        'p-4': variant === 'compact',
        'p-6': variant === 'default',
        'p-8': variant === 'detailed'
      },
      
      // Estilos de zona si aplica
      zoneStyles?.border && zone ? `border-l-4 ${zoneStyles.border}` : '',
      
      // Clase personalizada
      className
    );
  };
  
  const getHeaderStyles = () => {
    return cn(
      'flex items-start justify-between',
      {
        'mb-2': variant === 'compact',
        'mb-4': variant === 'default',
        'mb-6': variant === 'detailed'
      }
    );
  };
  
  // =====================================================
  // RENDERIZADO DE MÉTRICAS
  // =====================================================
  
  const renderMetrics = () => {
    if (!metrics || metrics.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {metrics.map((metric, index) => {
          const metricColors = theme.metrics[metric.color || 'neutral'];
          
          return (
            <div
              key={index}
              className={cn(
                'p-3 rounded-lg border',
                metricColors.bg,
                metricColors.border
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-medium', metricColors.text)}>
                  {metric.label}
                </span>
                {metric.trend && (
                  <span className={cn(
                    'text-xs',
                    {
                      'text-green-600': metric.trend === 'up',
                      'text-red-600': metric.trend === 'down',
                      'text-gray-600': metric.trend === 'neutral'
                    }
                  )}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                )}
              </div>
              <div className={cn('text-lg font-bold mt-1', metricColors.text)}>
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // =====================================================
  // RENDERIZADO DE ACCIONES
  // =====================================================
  
  const renderActions = () => {
    if (!actions) return null;
    
    return (
      <div className="flex items-center gap-2 mt-4">
        {actions.secondary && (
          <Button
            variant="outline"
            size="sm"
            onClick={actions.secondary.onClick}
            disabled={actions.secondary.disabled}
          >
            {actions.secondary.label}
          </Button>
        )}
        {actions.primary && (
          <Button
            size="sm"
            onClick={actions.primary.onClick}
            disabled={actions.primary.disabled}
          >
            {actions.primary.label}
          </Button>
        )}
      </div>
    );
  };
  
  // =====================================================
  // RENDERIZADO PRINCIPAL
  // =====================================================
  
  return (
    <Card className={getCardStyles()}>
      <CardHeader className={getHeaderStyles()}>
        <div className="flex items-start gap-3">
          {Icon && (
            <div className={cn(
              'p-2 rounded-lg',
              zone ? theme.zones[zone].bg : 'bg-muted'
            )}>
              <Icon className={cn(
                'h-4 w-4',
                zone ? theme.zones[zone].text : 'text-muted-foreground'
              )} />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className={cn(
                theme.typography.headings.h4,
                'mb-0'
              )}>
                {title}
              </CardTitle>
              {badge && (
                <Badge variant={badge.variant || 'default'}>
                  {badge.text}
                </Badge>
              )}
            </div>
            
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Métricas destacadas */}
        {renderMetrics()}
        
        {/* Contenido principal */}
        <div className={cn(
          'relative',
          loading && 'opacity-50 pointer-events-none'
        )}>
          {children}
          
          {/* Overlay de carga */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        {/* Acciones */}
        {renderActions()}
      </CardContent>
    </Card>
  );
}

// =====================================================
// COMPONENTES ESPECIALIZADOS
// =====================================================

/**
 * Card específico para métricas de zona
 */
export function ZoneAnalysisCard({
  zone,
  title,
  description,
  children,
  ...props
}: AnalysisCardProps & {
  zone: keyof typeof theme.zones;
}) {
  const zoneData = theme.zones[zone];
  
  return (
    <AnalysisCard
      {...props}
      zone={zone}
      title={title || zoneData.name}
      description={description || zoneData.description}
      icon={undefined} // Se puede personalizar
    >
      {children}
    </AnalysisCard>
  );
}

/**
 * Card compacto para KPIs
 */
export function KPIAnalysisCard({
  title,
  value,
  trend,
  color = 'neutral',
  ...props
}: Omit<AnalysisCardProps, 'children' | 'metrics'> & {
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <AnalysisCard
      {...props}
      title={title}
      variant="compact"
      metrics={[{
        label: title,
        value,
        trend,
        color
      }]}
    >
      <div /> {/* Contenido vacío, las métricas se muestran arriba */}
    </AnalysisCard>
  );
}

/**
 * Card para comparaciones
 */
export function ComparisonAnalysisCard({
  title,
  description,
  comparisons,
  ...props
}: Omit<AnalysisCardProps, 'children'> & {
  comparisons: Array<{
    label: string;
    current: number;
    previous: number;
    unit?: string;
  }>;
}) {
  const renderComparisons = () => {
    return (
      <div className="space-y-3">
        {comparisons.map((comp, index) => {
          const change = comp.current - comp.previous;
          const changePercent = comp.previous > 0 ? (change / comp.previous) * 100 : 0;
          const isPositive = change > 0;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">{comp.label}</div>
                <div className="text-xs text-muted-foreground">
                  {comp.previous.toLocaleString()} {comp.unit || ''} → {comp.current.toLocaleString()} {comp.unit || ''}
                </div>
              </div>
              <div className={cn(
                'text-sm font-medium',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <AnalysisCard
      {...props}
      title={title}
      description={description}
    >
      {renderComparisons()}
    </AnalysisCard>
  );
}

// =====================================================
// EXPORTS
// =====================================================

export default AnalysisCard;

