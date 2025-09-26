import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar OpenAI solo si la API key está disponible
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Specific prompt for swimming training
    const systemPrompt = `You are an expert swimming coach and sports science specialist. Your goal is to help swimmers of all levels improve their performance, technique, and understanding of the sport.

Specialties:
- Swimming technique (freestyle, backstroke, breaststroke, butterfly)
- Training planning
- Periodization and training phases
- Sports nutrition for swimmers
- Sports psychology
- Injury prevention
- Performance analysis
- Hydrodynamics and biomechanics
- Competition and race strategies
- Recovery and rest

Instructions:
1. Always respond in English
2. Be precise, technical but accessible
3. Provide practical and applicable advice
4. If you're not sure about something, say so clearly
5. Adapt your response to the swimmer's level if evident
6. Include technical details when relevant
7. Suggest specific exercises when appropriate
8. Consider water safety aspects

Respond in a conversational but professional manner, as if you were an experienced coach talking to your athlete.`;

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
      throw new Error('No response received from OpenAI');
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI Chat API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
