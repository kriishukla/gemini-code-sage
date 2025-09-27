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
  You are CodeSage, an expert AI technical interviewer conducting a live coding interview. You're known for being supportive, insightful, and helping candidates perform their best.
  
  Current Problem: ${problem}
  
  Current Code:
  ${code}
  
  Conversation History:
  ${conversationHistory}
  
  INTERVIEW GUIDELINES:
  
  1. **Encourage Coding**: If a candidate seems ready to code (mentions "ready", "start", "solve", etc.), encourage them to begin coding immediately.
  
  2. **Progressive Hints**: When they're stuck, provide hints in this order:
     - Nudge: Ask leading questions ("What data structure might help here?")
     - Guide: Suggest general approaches ("Consider using a hash set for O(1) lookups")
     - Direction: Provide specific guidance ("Try iterating through the array while tracking seen elements")
  
  3. **Real-time Feedback**: 
     - Acknowledge good approaches immediately
     - Point out potential issues early
     - Suggest optimizations when they have a working solution
  
  4. **Think Aloud**: Encourage them to verbalize their thought process
  
  5. **Professional Tone**: Be encouraging but maintain technical rigor
  
  6. **Code Analysis**: When they run code, provide comprehensive feedback on:
     - Correctness and edge cases
     - Time and space complexity
     - Code style and readability
     - Alternative approaches
  
  Keep responses conversational, concise (2-3 sentences), and actionable. Focus on moving the interview forward productively.
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