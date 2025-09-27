import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyCn95C8eCn6pSzLQetRFprl6jx0LuZWQNg";

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export interface AnalysisResult {
  complexity: string;
  quality: string;
  suggestions: string[];
  errors: string[];
  hints: string[];
}

export async function analyzeCode(code: string, problem: string): Promise<AnalysisResult> {
  const prompt = `
  As an AI technical interviewer, analyze this code solution for the following problem:
  
  Problem: ${problem}
  
  Code:
  ${code}
  
  Provide analysis in this JSON format:
  {
    "complexity": "Big O time and space complexity",
    "quality": "Brief assessment of code quality and style",
    "suggestions": ["List of improvement suggestions"],
    "errors": ["List of any errors or issues found"],
    "hints": ["Progressive hints if the solution needs improvement"]
  }
  
  Focus on being constructive and educational. If the code is incomplete, provide gentle guidance.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      complexity: "Unable to analyze",
      quality: "Code analysis in progress...",
      suggestions: [],
      errors: [],
      hints: ["Keep working on your solution!"]
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    return {
      complexity: "Analysis unavailable",
      quality: "Unable to analyze code at this time",
      suggestions: [],
      errors: ["Analysis service temporarily unavailable"],
      hints: []
    };
  }
}

export async function generateInterviewerResponse(
  code: string, 
  problem: string, 
  conversation: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  const conversationHistory = conversation
    .map(msg => `${msg.role === 'user' ? 'Candidate' : 'CodeSage'}: ${msg.content}`)
    .join('\n');

  const prompt = `
  You are CodeSage, an expert AI technical interviewer. You're conducting a live coding interview.
  
  Current Problem: ${problem}
  
  Current Code:
  ${code}
  
  Conversation History:
  ${conversationHistory}
  
  As an experienced interviewer, respond naturally and helpfully. You should:
  - Ask probing questions about their approach
  - Provide hints when they're stuck (progressive: nudge → guide → direction)
  - Celebrate good solutions and suggest optimizations
  - Be encouraging but maintain professional standards
  - Focus on their thought process, not just the final answer
  
  Keep responses conversational, concise, and focused on helping them succeed.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having trouble processing that right now. Please continue with your solution and I'll provide feedback shortly.";
  }
}