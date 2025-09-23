// Servicio de detección automática de zonas con OpenAI
import OpenAI from 'openai';

export interface ZoneDetectionResult {
  zones: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
  confidence: number;
  reasoning: string;
  suggestions: string[];
}

export interface ZoneDetectionRequest {
  content: string;
  objective?: string;
  timeSlot?: 'AM' | 'PM';
}

export class AIZoneDetector {
  private client: OpenAI | null;

  constructor() {
    // Solo inicializar si la API key está disponible
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      this.client = null;
    }
  }

  /**
   * Detecta automáticamente las zonas de entrenamiento usando OpenAI
   */
  async detectZones(request: ZoneDetectionRequest): Promise<ZoneDetectionResult> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return this.parseResponse(content);
    } catch (error) {
      console.error('Error detecting zones:', error);
      return this.getFallbackResult();
    }
  }

  /**
   * Construye el prompt para OpenAI
   */
  private buildPrompt(request: ZoneDetectionRequest): string {
    const { content } = request;
    
    return `Analiza este entrenamiento de natación y extrae los metros por zona:

ENTRENAMIENTO: ${content}

ZONAS:
- Z1: Calentamiento, recuperación, vuelta a la calma
- Z2: Aeróbico base, resistencia
- Z3: Tempo, umbral aeróbico  
- Z4: Velocidad, alta intensidad
- Z5: VO2 Max, sprint, máxima intensidad

Responde SOLO con este JSON:
{
  "zones": { "z1": 0, "z2": 0, "z3": 0, "z4": 0, "z5": 0 },
  "confidence": 85,
  "reasoning": "Explicación",
  "suggestions": ["Sugerencia 1"]
}`;
  }

  /**
   * Obtiene el prompt del sistema para OpenAI
   */
  private getSystemPrompt(): string {
    return `Eres un experto en natación. Analiza entrenamientos y extrae metros por zona. Responde solo con JSON válido.`;
  }

  /**
   * Parsea la respuesta de OpenAI
   */
  private parseResponse(content: string): ZoneDetectionResult {
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        zones: {
          z1: parsed.zones?.z1 || 0,
          z2: parsed.zones?.z2 || 0,
          z3: parsed.zones?.z3 || 0,
          z4: parsed.zones?.z4 || 0,
          z5: parsed.zones?.z5 || 0,
        },
        confidence: parsed.confidence || 0,
        reasoning: parsed.reasoning || 'Análisis automático completado',
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return this.getFallbackResult();
    }
  }

  /**
   * Resultado de fallback cuando hay errores
   */
  private getFallbackResult(): ZoneDetectionResult {
    return {
      zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      confidence: 0,
      reasoning: 'No se pudo analizar automáticamente. Por favor, completa manualmente.',
      suggestions: ['Revisa la descripción del entrenamiento', 'Asegúrate de incluir distancias y zonas']
    };
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;
  }
}

// Instancia singleton
export const aiZoneDetector = new AIZoneDetector();
