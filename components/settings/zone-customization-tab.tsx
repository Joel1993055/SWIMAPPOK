'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/core/contexts/theme-context';
import { Eye, Palette, RotateCcw, Save } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const ZoneCustomizationTab = memo(function ZoneCustomizationTab() {
  const { theme, updateZoneName, updateZoneColor, resetToDefault, isLoading } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [localTheme, setLocalTheme] = useState(theme);

  // Colores predefinidos para elegir
  const predefinedColors = [
    { name: 'Verde', hex: '#10b981', bg: 'bg-green-500' },
    { name: 'Azul', hex: '#3b82f6', bg: 'bg-blue-500' },
    { name: 'Amarillo', hex: '#eab308', bg: 'bg-yellow-500' },
    { name: 'Naranja', hex: '#f97316', bg: 'bg-orange-500' },
    { name: 'Rojo', hex: '#ef4444', bg: 'bg-red-500' },
    { name: 'Púrpura', hex: '#8b5cf6', bg: 'bg-purple-500' },
    { name: 'Cian', hex: '#06b6d4', bg: 'bg-cyan-500' },
    { name: 'Lima', hex: '#84cc16', bg: 'bg-lime-500' },
    { name: 'Ámbar', hex: '#f59e0b', bg: 'bg-amber-500' },
    { name: 'Rosa', hex: '#ec4899', bg: 'bg-pink-500' },
  ];

  const handleNameChange = useCallback((zone: keyof typeof theme.zones, name: string) => {
    setLocalTheme(prev => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: {
          ...prev.zones[zone],
          name,
        },
      },
    }));
    setHasChanges(true);
  }, []);

  const handleColorChange = useCallback((zone: keyof typeof theme.zones, hex: string) => {
    setLocalTheme(prev => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: {
          ...prev.zones[zone],
          hex,
        },
      },
      colors: {
        zones: prev.colors.zones.map((color, index) => 
          index === parseInt(zone.slice(1)) - 1 ? hex : color
        ),
      },
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    // Aplicar cambios al tema global
    Object.entries(localTheme.zones).forEach(([zone, config]) => {
      updateZoneName(zone as keyof typeof theme.zones, config.name);
      updateZoneColor(zone as keyof typeof theme.zones, config.hex);
    });
    setHasChanges(false);
  }, [localTheme, updateZoneName, updateZoneColor]);

  const handleReset = useCallback(() => {
    resetToDefault();
    setLocalTheme(theme);
    setHasChanges(false);
  }, [resetToDefault, theme]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Cargando configuración de zonas...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuración de Zonas */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personalización de Zonas
          </CardTitle>
          <CardDescription>
            Personaliza los nombres y colores de las zonas de entrenamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zonas */}
          <div className="space-y-6">
            {Object.entries(localTheme.zones).map(([zoneKey, zone]) => {
              const zoneNumber = zoneKey.slice(1); // Z1 -> 1
              return (
                <div key={zoneKey} className="space-y-4 p-4 border rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: zone.hex }}
                    >
                      {zoneNumber}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        Zona {zoneNumber}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {zone.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor={`${zoneKey}-name`}>Nombre de la zona</Label>
                      <Input
                        id={`${zoneKey}-name`}
                        value={zone.name}
                        onChange={(e) => handleNameChange(zoneKey as keyof typeof theme.zones, e.target.value)}
                        placeholder={`Ej: Zona ${zoneNumber}`}
                      />
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label>Color de la zona</Label>
                      <div className="flex gap-2 flex-wrap">
                        {predefinedColors.map((color) => (
                          <button
                            key={color.hex}
                            onClick={() => handleColorChange(zoneKey as keyof typeof theme.zones, color.hex)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              zone.hex === color.hex 
                                ? 'border-foreground scale-110' 
                                : 'border-muted-foreground/30 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h4 className="font-medium text-foreground">Vista Previa</h4>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {Object.entries(localTheme.zones).map(([zoneKey, zone]) => (
                  <div 
                    key={zoneKey}
                    className="p-3 rounded-lg border text-center"
                    style={{ 
                      backgroundColor: `${zone.hex}20`,
                      borderColor: `${zone.hex}40`
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: zone.hex }}
                    />
                    <div className="text-sm font-medium" style={{ color: zone.hex }}>
                      {zoneKey}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {zone.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar por defecto
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Los cambios se aplicarán automáticamente a todos los gráficos de la aplicación
          </p>
          <p>
            • Los colores se sincronizarán con el sistema de diseño
          </p>
          <p>
            • La configuración se guarda automáticamente en tu navegador
          </p>
          <p>
            • Puedes restaurar la configuración por defecto en cualquier momento
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
