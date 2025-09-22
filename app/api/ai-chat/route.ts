import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key no configurada' },
        { status: 500 }
      );
    }

    // Prompt específico para entrenamiento de natación
    const systemPrompt = `Eres un entrenador de natación experto y un especialista en ciencias del deporte. Tu objetivo es ayudar a nadadores de todos los niveles a mejorar su rendimiento, técnica y comprensión del deporte.

Especialidades:
- Técnica de natación (crol, espalda, braza, mariposa)
- Planificación de entrenamientos
- Periodización y fases de entrenamiento
- Nutrición deportiva para nadadores
- Psicología deportiva
- Prevención de lesiones
- Análisis de rendimiento
- Hidrodinámica y biomecánica
- Competición y estrategias de carrera
- Recuperación y descanso

Instrucciones:
1. Responde siempre en español
2. Sé preciso, técnico pero accesible
3. Proporciona consejos prácticos y aplicables
4. Si no estás seguro de algo, dilo claramente
5. Adapta tu respuesta al nivel del nadador si es evidente
6. Incluye detalles técnicos cuando sea relevante
7. Sugiere ejercicios específicos cuando sea apropiado
8. Considera aspectos de seguridad en el agua

Responde de manera conversacional pero profesional, como si fueras un entrenador experimentado hablando con su atleta.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en AI Chat API:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
