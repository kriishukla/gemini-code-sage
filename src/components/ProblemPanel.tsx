import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Target, Code, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit?: number;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    passed?: boolean;
  }>;
}

interface ProblemPanelProps {
  problem: Problem;
  timeElapsed?: number;
  testResults?: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }>;
}

export const ProblemPanel = ({ problem, timeElapsed = 0, testResults }: ProblemPanelProps) => {
  const testResultsRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-status-success text-status-success';
      case 'Medium': return 'bg-status-hint text-status-hint';
      case 'Hard': return 'bg-status-error text-status-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Auto-scroll to test results when they appear
  useEffect(() => {
    if (testResults && testResults.length > 0 && testResultsRef.current) {
      setTimeout(() => {
        testResultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 200);
    }
  }, [testResults]);

  return (
    <div className="h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-card/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">{problem.title}</h2>
            <div className="flex items-center gap-3">
              <Badge className={`${getDifficultyColor(problem.difficulty)} bg-opacity-20`}>
                {problem.difficulty}
              </Badge>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(timeElapsed)}</span>
              </div>

              {problem.timeLimit && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">{problem.timeLimit} min limit</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Problem Description */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Problem Description</h3>
            <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="font-medium text-sm text-foreground mb-2">
                    Example {index + 1}:
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Input:</span>
                      <code className="ml-2 bg-code-bg text-foreground px-2 py-1 rounded font-mono">
                        {example.input}
                      </code>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Output:</span>
                      <code className="ml-2 bg-code-bg text-foreground px-2 py-1 rounded font-mono">
                        {example.output}
                      </code>
                    </div>

                    {example.explanation && (
                      <div>
                        <span className="text-muted-foreground">Explanation:</span>
                        <span className="ml-2 text-muted-foreground">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Constraints</h3>
              <ul className="space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Results */}
          {testResults && testResults.length > 0 && (
            <motion.div
              ref={testResultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-border/50 pt-6"
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Test Results
              </h3>
              
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      result.passed 
                        ? 'border-status-success/30 bg-status-success/10' 
                        : 'border-status-error/30 bg-status-error/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-status-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-status-error" />
                      )}
                      <span className="font-medium text-sm">
                        Test Case {index + 1}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Input:</span>
                        <code className="ml-2 bg-code-bg text-foreground px-1 rounded font-mono">
                          {result.input}
                        </code>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Expected:</span>
                        <code className="ml-2 bg-code-bg text-status-success px-1 rounded font-mono">
                          {result.expectedOutput}
                        </code>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Got:</span>
                        <code className={`ml-2 px-1 rounded font-mono ${
                          result.passed 
                            ? 'bg-code-bg text-status-success' 
                            : 'bg-code-bg text-status-error'
                        }`}>
                          {result.actualOutput}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};