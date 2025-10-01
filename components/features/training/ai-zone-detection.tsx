'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIZoneDetection } from '@/core/hooks/use-ai-zone-detection';
import { AlertCircle, Brain, CheckCircle, Lightbulb, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AIZoneDetectionProps {
  content: string;
  objective?: string;
  timeSlot?: 'AM' | 'PM';
  onZonesDetected: (zones: { z1: number; z2: number; z3: number; z4: number; z5: number }) => void;
  disabled?: boolean;
}

export function AIZoneDetection({
  content,
  objective,
  timeSlot,
  onZonesDetected,
  disabled = false,
}: AIZoneDetectionProps) {
  const { isDetecting, result, error, detectZones, reset } = useAIZoneDetection();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDetect = async () => {
    if (!content || !content.trim()) return;
    await detectZones(content, objective, timeSlot);
  };

  const handleApplyZones = () => {
    if (result?.zones) {
      onZonesDetected(result.zones);
      setIsExpanded(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confidence >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  if (!content || !content.trim()) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border border-dashed">
        <div className="text-center text-muted-foreground">
          <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Write your workout to enable automatic zone detection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Automatic Zone Detection</span>
        </div>
        {result && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2 text-xs"
          >
            {isExpanded ? 'Hide' : 'Details'}
          </Button>
        )}
      </div>

      {/* Detect button */}
      <div className="space-y-3">
        <Button
          onClick={handleDetect}
          disabled={isDetecting || disabled}
          className="w-full h-9"
          size="sm"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-3 w-3 mr-2" />
              Detect Zones with AI
            </>
          )}
        </Button>

        {/* Compact error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Detection error</p>
                <p className="text-xs text-destructive/80">{error}</p>
                {error.includes('OpenAI') && (
                  <div className="text-xs bg-muted p-2 rounded mt-2">
                    <p className="font-medium">How to fix:</p>
                    <ul className="list-disc list-inside space-y-0.5 mt-1">
                      <li>Set <code>OPENAI_API_KEY</code> in <code>.env.local</code></li>
                      <li>Restart the dev server</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compact result */}
        {result && (
          <div className="space-y-3">
            {/* Compact summary */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {getConfidenceIcon(result.confidence)}
                <span className={`font-medium ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}% confidence
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Object.values(result.zones).reduce((sum, zone) => sum + zone, 0)}m total
              </Badge>
            </div>

            {/* Compact detected zones */}
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(result.zones).map(([zone, meters]) => (
                <div key={zone} className="text-center p-2 border rounded bg-background/50">
                  <div className="text-xs font-medium text-muted-foreground">
                    {zone.toUpperCase()}
                  </div>
                  <div className="text-sm font-bold">{meters}m</div>
                </div>
              ))}
            </div>

            {/* Compact apply button */}
            <Button
              onClick={handleApplyZones}
              className="w-full h-8"
              size="sm"
              disabled={result.confidence < 30}
            >
              <CheckCircle className="h-3 w-3 mr-2" />
              Apply Zones
            </Button>

            {/* Expandable compact details */}
            {isExpanded && (
              <div className="space-y-2 pt-3 border-t">
                {/* Reasoning */}
                <div>
                  <h4 className="text-xs font-medium mb-1">AI Analysis:</h4>
                  <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                    {result.reasoning}
                  </p>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium mb-1 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      Suggestions:
                    </h4>
                    <ul className="space-y-0.5">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
