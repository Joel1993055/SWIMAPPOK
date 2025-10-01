'use client';

import { useAppContext } from '@/core/contexts/app-context';
import { Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Componente para mostrar el contexto actual (club/grupo seleccionado)
 */
export function ContextIndicator() {
  const { currentClub, currentGroup, hasContext } = useAppContext();

  if (!hasContext) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">No context selected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1">
        <Building2 className="h-3 w-3" />
        <span className="text-xs">{currentClub?.name}</span>
      </Badge>
      <Badge variant="outline" className="gap-1">
        <Users className="h-3 w-3" />
        <span className="text-xs">{currentGroup?.name}</span>
      </Badge>
    </div>
  );
}
