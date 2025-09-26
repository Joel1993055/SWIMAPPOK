// Automatic training zone detection service with OpenAI
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
    // Initialize only if the API key is available
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      this.client = null;
    }
  }

  /**
   * Automatically detects training zones using OpenAI
   */
  async detectZones(request: ZoneDetectionRequest): Promise<ZoneDetectionResult> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set the OPENAI_API_KEY environment variable.');
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
   * Builds the user prompt for OpenAI
   */
  private buildPrompt(request: ZoneDetectionRequest): string {
    const { content } = request;
    
    return `Analyze this swim workout and extract meters per zone:

WORKOUT: ${content}

ZONES:
- Z1: Warm-up, recovery, cool-down
- Z2: Aerobic base, endurance
- Z3: Tempo, aerobic threshold
- Z4: Speed, high intensity
- Z5: VO2 Max, sprint, maximal intensity

Reply ONLY with this JSON:
{
  "zones": { "z1": 0, "z2": 0, "z3": 0, "z4": 0, "z5": 0 },
  "confidence": 85,
  "reasoning": "Explanation",
  "suggestions": ["Suggestion 1"]
}`;
  }

  /**
   * System prompt for OpenAI
   */
  private getSystemPrompt(): string {
    return `You are a swimming coach expert. Analyze workouts and extract meters per intensity zone. Reply with valid JSON only.`;
  }

  /**
   * Parses OpenAI response content to a ZoneDetectionResult
   */
  private parseResponse(content: string): ZoneDetectionResult {
    try {
      // Extract just the JSON from the response
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
        reasoning: parsed.reasoning || 'Automatic analysis completed',
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return this.getFallbackResult();
    }
  }

  /**
   * Fallback result when an error occurs
   */
  private getFallbackResult(): ZoneDetectionResult {
    return {
      zones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      confidence: 0,
      reasoning: 'Automatic analysis could not be performed. Please complete it manually.',
      suggestions: [
        'Review the workout description',
        'Be sure to include distances and zones'
      ]
    };
  }

  /**
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;
  }
}

// Singleton instance
export const aiZoneDetector = new AIZoneDetector();
