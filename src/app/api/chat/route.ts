import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, sources = [] } = await request.json();

    // Build context from available sources
    const sourceContext = sources.length > 0 
      ? `Available sources:\n${sources.map((source: any) => 
          `- ${source.name} (${source.type}): ${source.content}`
        ).join('\n\n')}\n\n`
      : '';
    
    const systemPrompt = `You are neoneo, a helpful AI assistant that helps non-technical users understand how their applications work. 

Your role is to:
1. Ask clarifying questions when users give vague requests
2. Explain technical concepts in plain language  
3. Reference and cite the provided source code/files when relevant
4. Help users understand flows, dependencies, and system architecture
5. Provide specific, actionable insights based on the codebase

${sources.length > 0 ? `You have full access to the source code from ${sources[0].name} and should reference it in your responses with specific citations to files, functions, and code sections. Use the complete repository content to provide detailed, accurate answers.` : 'When sources are available, always cite them in your responses.'}

Always be conversational, helpful, and ask follow-up questions to better understand what the user needs.`;

    const userPrompt = `${sourceContext}User message: "${message}"

Previous conversation context: ${conversationHistory ? JSON.stringify(conversationHistory) : 'No previous context'}

${sources.length > 0 
  ? `Based on the provided sources, please answer the user's question. Include specific citations to relevant files, functions, or code sections. If you need clarification, ask specific questions about the codebase or system.`
  : `Please respond with clarifying questions to help understand what the user needs. Ask about:
- Which part of the system they're asking about
- What their role is (PM, designer, support, etc.)  
- Whether they need technical details or business impact
- If they can provide code/documentation to analyze`}

Format your response as a natural conversation.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the full prompt combining system and user prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text() || "I'm sorry, I couldn't generate a response. Could you try rephrasing your question?";

    // Extract potential citations from the response (simple implementation)
    const citations: string[] = [];
    if (sources.length > 0) {
      sources.forEach((source: any) => {
        if (response.toLowerCase().includes(source.name.toLowerCase())) {
          citations.push(source.name);
        }
      });
    }

    return NextResponse.json({
      response,
      citations,
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