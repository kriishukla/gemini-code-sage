import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { InterviewerChat } from './InterviewerChat';
import { ProblemPanel } from './ProblemPanel';
import { AnalysisPopup } from './AnalysisPopup';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Play, BarChart3, MessageSquare, FileText, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeCode, generateInterviewerResponse, type AnalysisResult } from '@/lib/gemini';

// Sample problems for the interview
const PROBLEMS = {
  FIND_DUPLICATES: {
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
    ],
    initialCode: `def find_duplicates(arr):
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
print(f"Duplicates: {result}")`
  },
  REVERSE_ARRAY: {
    id: 'reverse-array',
    title: 'Reverse an Array',
    difficulty: 'Easy' as const,
    description: 'Given an array of integers, reverse the array in-place. You should modify the original array directly without using extra space for another array.',
    timeLimit: 30,
    examples: [
      {
        input: '[1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'The array is reversed in-place.'
      },
      {
        input: '[10, 20]',
        output: '[20, 10]',
        explanation: 'Simple two-element array reversal.'
      }
    ],
    constraints: [
      '1 ≤ array length ≤ 10,000',
      '-1000 ≤ array elements ≤ 1000',
      'Modify the array in-place (O(1) extra space)'
    ],
    initialCode: `def reverse_array(arr):
    """
    Reverse the given array in-place.
    
    Args:
        arr: List of integers to reverse
        
    Returns:
        None (modifies the array in-place)
    """
    # Your solution here
    pass

# Test your solution
test_array = [1, 2, 3, 4, 5]
print(f"Original: {test_array}")
reverse_array(test_array)
print(f"Reversed: {test_array}")`
  },
  TRAPPING_RAIN_WATER: {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard' as const,
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    timeLimit: 60,
    examples: [
      {
        input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map traps 6 units of rain water.'
      },
      {
        input: '[4,2,0,3,2,5]',
        output: '9',
        explanation: 'Water gets trapped between the elevations.'
      }
    ],
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 * 10^4',
      '0 ≤ height[i] ≤ 3 * 10^4'
    ],
    initialCode: `def trap_rain_water(height):
    """
    Calculate how much rain water can be trapped.
    
    Args:
        height: List of non-negative integers representing elevation map
        
    Returns:
        Integer representing units of water trapped
    """
    # Your solution here
    pass

# Test your solution
elevation = [0,1,0,2,1,0,1,3,2,1,2,1]
result = trap_rain_water(elevation)
print(f"Elevation: {elevation}")
print(f"Water trapped: {result} units")`
  }
};

const SAMPLE_PROBLEM = PROBLEMS.FIND_DUPLICATES;
const INITIAL_CODE = SAMPLE_PROBLEM.initialCode;

interface InterviewInterfaceProps {
  onCodeRun?: () => void;
  onTestResults?: (results: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }>) => void;
  onCodeChange?: (code: string) => void;
  onAIInteraction?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'hint' | 'analysis' | 'question';
}

export const InterviewInterface = ({ 
  onCodeRun, 
  onTestResults, 
  onCodeChange, 
  onAIInteraction 
}: InterviewInterfaceProps = {}) => {
  const [currentProblem, setCurrentProblem] = useState<keyof typeof PROBLEMS>('FIND_DUPLICATES');
  const [code, setCode] = useState(PROBLEMS.FIND_DUPLICATES.initialCode);
  
  // Wrapper for setCode to notify parent
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm CodeSage, your AI technical interviewer. I'll be guiding you through this coding challenge. Take your time to read the problem, and feel free to think aloud as you work. I'm here to help with hints and feedback. Are you ready to begin?",
      timestamp: new Date(),
    }
  ]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
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
    
    // Notify parent about code run
    onCodeRun?.();
    
    // Analyze code first
    try {
      const analysisResult = await analyzeCode(code, PROBLEMS[currentProblem].description);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    
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
      }
    ];
    
    setTestResults(mockResults);
    setIsRunning(false);
    
    // Notify parent about test results
    onTestResults?.(mockResults);

    // Show analysis popup
    setShowAnalysisPopup(true);

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
    setCode(PROBLEMS[currentProblem].initialCode);
    setAnalysis(null);
    setShowAnalysisPopup(false);
    setTestResults(null);
  };

  const handleSubmitProblem = async () => {
    // Check if current problem is solved (all tests pass)
    const isSolved = testResults && testResults.every(result => result.passed);
    
    if (currentProblem === 'FIND_DUPLICATES') {
      if (isSolved) {
        // Load Trapping Rain Water (harder problem)
        setCurrentProblem('TRAPPING_RAIN_WATER');
      } else {
        // Load Reverse Array (easier problem)
        setCurrentProblem('REVERSE_ARRAY');
      }
    } else if (currentProblem === 'REVERSE_ARRAY') {
      // Always load Trapping Rain Water next
      setCurrentProblem('TRAPPING_RAIN_WATER');
    } else {
      // Already at the final problem
      await handleSendMessage("Congratulations! You've completed all the coding challenges. The interview is now complete.", 'assistant');
      return;
    }

    // Get the next problem key
    const nextProblemKey = currentProblem === 'FIND_DUPLICATES' 
      ? (isSolved ? 'TRAPPING_RAIN_WATER' : 'REVERSE_ARRAY') 
      : 'TRAPPING_RAIN_WATER';

    // Reset state for new problem
    setCode(PROBLEMS[nextProblemKey].initialCode);
    setTestResults(null);
    setAnalysis(null);
    
    // Send AI message about new problem
    const nextProblemTitle = PROBLEMS[nextProblemKey].title;
    await handleSendMessage(`Great! Now let's move on to the next challenge: "${nextProblemTitle}". Take your time to read through the problem description.`, 'assistant');
  };

  const handleSendMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Notify parent about AI interaction
    if (role === 'user') {
      onAIInteraction?.();
    }

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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm flex-shrink-0"
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

      {/* Main Interface with Individual Scrollers */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem Questions */}
          <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin smooth-scroll">
                <div className="p-4 space-y-4">
                  <ProblemPanel 
                    problem={PROBLEMS[currentProblem]}
                    timeElapsed={timeElapsed}
                    testResults={testResults}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-border/50 hover:bg-border transition-colors" />

          {/* Center Panel - Code Editor */}
          <ResizablePanel defaultSize={45} minSize={30} className="flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={handleCodeChange}
                  onRun={handleRunCode}
                  onReset={handleResetCode}
                  onSubmit={handleSubmitProblem}
                  language="python"
                  isRunning={isRunning}
                  canSubmit={testResults !== null}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-border/50 hover:bg-border transition-colors" />

          {/* Right Panel - AI Chat */}
          <ResizablePanel defaultSize={30} minSize={25} className="flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-hidden">
                <InterviewerChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isThinking={isThinking}
                  currentHints={currentHints}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Analysis Popup */}
      <AnalysisPopup
        analysis={analysis}
        isOpen={showAnalysisPopup}
        onOpenChange={setShowAnalysisPopup}
      />
    </div>
  );
};