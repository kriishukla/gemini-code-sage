import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { InterviewerChat } from './InterviewerChat';
import { ProblemPanel } from './ProblemPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Play, BarChart3, MessageSquare, FileText, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeCode, generateInterviewerResponse, type AnalysisResult } from '@/lib/gemini';

// Sample problem for demo
const SAMPLE_PROBLEM = {
  id: 'find-duplicates',
  title: 'Find Duplicates in Array',
  difficulty: 'Medium' as const,
  description: 'Given an array of integers, find all duplicate elements and return them in a new array. Each duplicate should appear only once in the result.',
  timeLimit: 45,
  examples: [
    {
      input: '[1, 2, 3, 2, 4, 3, 5]',
      output: '[2, 3]',
      explanation: 'Numbers 2 and 3 appear more than once in the input array.'
    },
    {
      input: '[1, 2, 3, 4, 5]',
      output: '[]',
      explanation: 'No duplicates found in the array.'
    }
  ],
  constraints: [
    '1 ≤ array length ≤ 10,000',
    '-1000 ≤ array elements ≤ 1000',
    'Return duplicates in the order they first appear'
  ]
};

const INITIAL_CODE = `def find_duplicates(arr):
    """
    Find all duplicate elements in the array.
    
    Args:
        arr: List of integers
        
    Returns:
        List of duplicate integers (each appearing once)
    """
    # Your solution here
    pass

# Test your solution
test_array = [1, 2, 3, 2, 4, 3, 5]
result = find_duplicates(test_array)
print(f"Input: {test_array}")
print(f"Duplicates: {result}")`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'hint' | 'analysis' | 'question';
}

export const InterviewInterface = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm CodeSage, your AI technical interviewer. I'll be guiding you through this coding challenge. Take your time to read the problem, and feel free to think aloud as you work. I'm here to help with hints and feedback. Are you ready to begin?",
      timestamp: new Date(),
    }
  ]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [testResults, setTestResults] = useState<Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }> | null>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-analyze code when it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim() && code !== INITIAL_CODE) {
        handleAnalyzeCode();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code]);

  const handleAnalyzeCode = async () => {
    try {
      const result = await analyzeCode(code, SAMPLE_PROBLEM.description);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution and test running
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock test results based on code content
    const mockResults = [
      {
        input: '[1, 2, 3, 2, 4, 3, 5]',
        expectedOutput: '[2, 3]',
        actualOutput: code.includes('set') || code.includes('dict') ? '[2, 3]' : '[]',
        passed: code.includes('set') || code.includes('dict')
      },
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '[]',
        actualOutput: '[]',
        passed: true
      },
      {
        input: '[5, 5, 5, 5]',
        expectedOutput: '[5]',
        actualOutput: code.includes('set') || code.includes('dict') ? '[5]' : '[5, 5, 5]',
        passed: code.includes('set') || code.includes('dict')
      }
    ];
    
    setTestResults(mockResults);
    setIsRunning(false);

    // Auto-generate AI feedback
    const passedTests = mockResults.filter(r => r.passed).length;
    const totalTests = mockResults.length;
    
    if (passedTests === totalTests) {
      await handleSendMessage("Great job! All test cases passed. Can you explain your approach?", 'assistant');
    } else {
      await handleSendMessage(`${passedTests}/${totalTests} test cases passed. Let me help you optimize your solution.`, 'assistant');
    }
  };

  const handleResetCode = () => {
    setCode(INITIAL_CODE);
    setAnalysis(null);
    setTestResults(null);
  };

  const handleSendMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (role === 'user') {
      setIsThinking(true);
      
      try {
        const response = await generateInterviewerResponse(
          code,
          SAMPLE_PROBLEM.description,
          [...messages, newMessage]
        );

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setIsThinking(false);
      }
    }
  };

  const currentHints = analysis?.hints || [];

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CS</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">CodeSage</h1>
              <Badge variant="secondary" className="text-xs">AI Technical Interviewer</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-sm">
                {Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:
                {(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <Badge 
              variant="outline" 
              className={`${
                testResults 
                  ? testResults.every(r => r.passed)
                    ? 'border-status-success text-status-success'
                    : 'border-status-error text-status-error'
                  : 'border-muted text-muted-foreground'
              }`}
            >
              {testResults 
                ? `${testResults.filter(r => r.passed).length}/${testResults.length} Tests`
                : 'Not Tested'
              }
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Interface */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <ProblemPanel 
              problem={SAMPLE_PROBLEM}
              timeElapsed={timeElapsed}
              testResults={testResults}
            />
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-border/50 hover:bg-border transition-colors" />

          {/* Center Panel - Code Editor */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              onReset={handleResetCode}
              language="python"
              analysis={analysis}
              isRunning={isRunning}
            />
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-border/50 hover:bg-border transition-colors" />

          {/* Right Panel - AI Chat */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <InterviewerChat
              messages={messages}
              onSendMessage={handleSendMessage}
              isThinking={isThinking}
              currentHints={currentHints}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};