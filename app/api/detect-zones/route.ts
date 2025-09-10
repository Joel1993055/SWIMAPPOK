import { aiZoneDetector } from '@/lib/services/ai-zone-detector';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, objective, timeSlot } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Verificar si OpenAI está configurado
    if (!aiZoneDetector.isConfigured()) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
          confidence: 0,
          reasoning: 'OpenAI no está configurado. Por favor, configura OPENAI_API_KEY en las variables de entorno.',
          suggestions: ['Configura OPENAI_API_KEY en .env.local']
        },
        { status: 503 }
      );
    }

    // Detectar zonas usando IA
    const result = await aiZoneDetector.detectZones({
      content,
      objective,
      timeSlot
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in detect-zones API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
        confidence: 0,
        reasoning: 'Error interno del servidor',
        suggestions: ['Intenta de nuevo más tarde']
      },
      { status: 500 }
    );
  }
}
