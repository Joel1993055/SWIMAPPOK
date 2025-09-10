// Servicio de detección automática de zonas con OpenAI
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
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Detecta automáticamente las zonas de entrenamiento usando OpenAI
   */
  async detectZones(request: ZoneDetectionRequest): Promise<ZoneDetectionResult> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
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
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error detecting zones:', error);
      return this.getFallbackResult();
    }
  }

  /**
   * Construye el prompt para OpenAI
   */
  private buildPrompt(request: ZoneDetectionRequest): string {
    const { content, objective, timeSlot } = request;
    
    let prompt = `Analiza este entrenamiento de natación y detecta automáticamente los metros por zona:\n\n`;
    prompt += `**Contenido del entrenamiento:**\n${content}\n\n`;
    
    if (objective) {
      prompt += `**Objetivo:** ${objective}\n`;
    }
    
    if (timeSlot) {
      prompt += `**Horario:** ${timeSlot}\n`;
    }
    
    prompt += `\n**Instrucciones:**\n`;
    prompt += `- Extrae los metros para cada zona (Z1-Z5)\n`;
    prompt += `- Z1: Recuperación, calentamiento, vuelta a la calma\n`;
    prompt += `- Z2: Aeróbico base, resistencia\n`;
    prompt += `- Z3: Tempo, umbral aeróbico\n`;
    prompt += `- Z4: Velocidad, alta intensidad\n`;
    prompt += `- Z5: VO2 Max, sprint, máxima intensidad\n`;
    prompt += `- Si no encuentras información específica, estima basándote en el contexto\n`;
    prompt += `- Proporciona un nivel de confianza (0-100)\n`;
    prompt += `- Explica tu razonamiento\n`;
    prompt += `- Sugiere mejoras si es necesario\n\n`;
    prompt += `**Formato de respuesta (JSON):**\n`;
    prompt += `{\n`;
    prompt += `  "zones": { "z1": 0, "z2": 0, "z3": 0, "z4": 0, "z5": 0 },\n`;
    prompt += `  "confidence": 85,\n`;
    prompt += `  "reasoning": "Explicación del análisis",\n`;
    prompt += `  "suggestions": ["Sugerencia 1", "Sugerencia 2"]\n`;
    prompt += `}`;

    return prompt;
  }

  /**
   * Obtiene el prompt del sistema para OpenAI
   */
  private getSystemPrompt(): string {
    return `Eres un experto en natación y análisis de entrenamientos. Tu tarea es analizar descripciones de entrenamientos de natación y detectar automáticamente los metros por zona de intensidad.

CONOCIMIENTO ESPECÍFICO:
- Z1 (Recuperación): Calentamiento, vuelta a la calma, nado suave
- Z2 (Aeróbico): Nado base, resistencia aeróbica, ritmo cómodo
- Z3 (Tempo): Umbral aeróbico, ritmo moderado-alto
- Z4 (Velocidad): Alta intensidad, series rápidas
- Z5 (VO2 Max): Máxima intensidad, sprints, series muy cortas

INSTRUCCIONES:
1. Analiza el contenido del entrenamiento
2. Identifica patrones de intensidad y distancias
3. Asigna metros a cada zona basándote en el contexto
4. Proporciona un nivel de confianza
5. Explica tu razonamiento
6. Sugiere mejoras si es necesario

RESPUESTA:
Siempre responde en formato JSON válido con la estructura especificada.`;
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
    return !!this.apiKey && this.apiKey.length > 0;
  }
}

// Instancia singleton
export const aiZoneDetector = new AIZoneDetector();
