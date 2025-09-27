import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { InterviewerChat } from './InterviewerChat';
import { ProblemPanel } from './ProblemPanel';
import { ExitInterview } from './ExitInterview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Play, BarChart3, MessageSquare, FileText, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeCode, generateInterviewerResponse, type AnalysisResult } from '@/lib/gemini';

// Sample problems
const PROBLEMS = [
  {
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
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard' as const,
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    timeLimit: 60,
    examples: [
      {
        input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map can trap 6 units of rain water.'
      },
      {
        input: '[4,2,0,3,2,5]',
        output: '9',
        explanation: 'The elevation map can trap 9 units of rain water.'
      }
    ],
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 * 10^4',
      '0 ≤ height[i] ≤ 3 * 10^4'
    ]
  }
];

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
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState(INITIAL_CODE);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm CodeSage, your AI technical interviewer. I'll be guiding you through this coding challenge. Take your time to read the problem, and feel free to think aloud as you work. When you're ready to start coding, just say something like 'I'm ready to code' or 'Let me start solving this'. I'm here to help with hints and feedback!",
      timestamp: new Date(),
    }
  ]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasCodingStarted, setHasCodingStarted] = useState(false);
  const [showExitInterview, setShowExitInterview] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }> | null>(null);

  const currentProblem = PROBLEMS[currentProblemIndex];

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
    if (!hasCodingStarted) return;
    try {
      const result = await analyzeCode(code, currentProblem.description);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution and test running
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock test results based on current problem and code content
    let mockResults: Array<{input: string; expectedOutput: string; actualOutput: string; passed: boolean;}> = [];
    
    if (currentProblem.id === 'find-duplicates') {
      mockResults = [
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
    } else if (currentProblem.id === 'trapping-rain-water') {
      mockResults = [
        {
          input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
          expectedOutput: '6',
          actualOutput: code.includes('min') && code.includes('max') ? '6' : '0',
          passed: code.includes('min') && code.includes('max')
        },
        {
          input: '[4,2,0,3,2,5]',
          expectedOutput: '9',
          actualOutput: code.includes('min') && code.includes('max') ? '9' : '0',
          passed: code.includes('min') && code.includes('max')
        }
      ];
    }
    
    setTestResults(mockResults);
    setIsRunning(false);

    // Auto-generate AI feedback
    const passedTests = mockResults.filter(r => r.passed).length;
    const totalTests = mockResults.length;
    
    if (passedTests === totalTests) {
      await handleSendMessage("Excellent! All test cases passed. Can you explain your approach and the time complexity?", 'assistant');
    } else {
      await handleSendMessage(`${passedTests}/${totalTests} test cases passed. Let me provide some hints to help you optimize your solution.`, 'assistant');
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
      // Check if user is ready to start coding
      const codingIndicators = ['ready to code', 'start coding', 'let me code', 'begin coding', 'solve this', 'start solving'];
      if (!hasCodingStarted && codingIndicators.some(indicator => content.toLowerCase().includes(indicator))) {
        setHasCodingStarted(true);
        const encourageMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "Perfect! You can now start coding in the editor. I'll be monitoring your progress and providing real-time feedback. Feel free to think aloud and ask for hints anytime!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, encourageMessage]);
        return;
      }

      setIsThinking(true);
      
      try {
        const response = await generateInterviewerResponse(
          code,
          currentProblem.description,
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

  const handleNextProblem = () => {
    if (currentProblemIndex < PROBLEMS.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setCode(INITIAL_CODE);
      setTestResults(null);
      setAnalysis(null);
      setHasCodingStarted(false);
      setTimeElapsed(0);
      
      const nextProblemMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great work on the previous problem! Now let's move to the next challenge: "${PROBLEMS[currentProblemIndex + 1].title}". Take your time to read through it, and let me know when you're ready to start coding!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, nextProblemMessage]);
    }
  };

  const handleExitInterview = () => {
    setShowExitInterview(true);
  };

  const currentHints = analysis?.hints || [];

  return (
    <div className="h-screen bg-background overflow-hidden">
      {showExitInterview && (
        <ExitInterview
          timeElapsed={timeElapsed}
          testResults={testResults}
          problemTitle={currentProblem.title}
          onClose={() => setShowExitInterview(false)}
        />
      )}
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
            
            <div className="flex items-center gap-2">
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

              {testResults && testResults.every(r => r.passed) && currentProblemIndex < PROBLEMS.length - 1 && (
                <Button onClick={handleNextProblem} size="sm" variant="outline">
                  Next Problem
                </Button>
              )}

              <Button onClick={handleExitInterview} size="sm" variant="outline">
                Exit Interview
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Interface */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <ProblemPanel 
              problem={currentProblem}
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