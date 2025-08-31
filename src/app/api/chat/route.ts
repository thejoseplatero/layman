import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // For MVP, we'll use a simple approach to generate clarifying questions
    // In production, this would analyze the codebase and provide contextual responses
    
    const systemPrompt = `You are Layman, a helpful AI assistant that helps non-technical users understand how their applications work. 

Your role is to:
1. Ask clarifying questions when users give vague requests
2. Explain technical concepts in plain language
3. Provide citations to relevant code files, APIs, or documentation
4. Generate simple diagrams when helpful
5. Help users understand flows, dependencies, and system architecture

Always be conversational, helpful, and ask follow-up questions to better understand what the user needs.`;

    const userPrompt = `User message: "${message}"

Previous conversation context: ${conversationHistory ? JSON.stringify(conversationHistory) : 'No previous context'}

Please respond with clarifying questions to help understand what the user needs. Be specific and ask about:
- Which part of the system they're asking about
- What their role is (PM, designer, support, etc.)
- Whether they need technical details or business impact
- Any specific scenarios or edge cases they're concerned about

Format your response as a natural conversation, not a list of questions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Could you try rephrasing your question?";

    return NextResponse.json({
      response,
      citations: [], // Will be populated when we integrate with codebase analysis
      diagram: null, // Will be populated when we add diagram generation
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
