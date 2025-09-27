import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, Code, Lightbulb, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ExitInterviewProps {
  timeElapsed: number;
  testResults: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }> | null;
  problemTitle: string;
  onClose: () => void;
}

export const ExitInterview = ({ timeElapsed, testResults, problemTitle, onClose }: ExitInterviewProps) => {
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const passedTests = testResults?.filter(r => r.passed).length || 0;
  const totalTests = testResults?.length || 0;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const performanceLevel = successRate >= 80 ? 'Excellent' : 
                          successRate >= 60 ? 'Good' : 
                          successRate >= 40 ? 'Fair' : 'Needs Improvement';

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Interview Complete!</h2>
            <p className="text-muted-foreground">Here's your performance summary</p>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-6">
              {/* Overall Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </Card>

                <Card className="p-4 text-center">
                  <Code className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{passedTests}/{totalTests}</div>
                  <div className="text-sm text-muted-foreground">Tests Passed</div>
                </Card>

                <Card className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </Card>
              </div>

              {/* Performance Level */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Overall Performance</h3>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`text-lg px-4 py-2 ${
                      successRate >= 80 ? 'border-status-success text-status-success' :
                      successRate >= 60 ? 'border-status-hint text-status-hint' :
                      'border-status-error text-status-error'
                    }`}
                  >
                    {performanceLevel}
                  </Badge>
                </div>
              </Card>

              {/* Test Results Detail */}
              {testResults && testResults.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Test Results for "{problemTitle}"</h3>
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
                          <span className="font-medium text-sm">Test Case {index + 1}</span>
                          <Badge variant={result.passed ? "secondary" : "destructive"} className="text-xs">
                            {result.passed ? "PASSED" : "FAILED"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Feedback & Recommendations */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Feedback & Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-status-hint" />
                      Strengths
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {successRate >= 80 && <li>• Excellent problem-solving approach</li>}
                      {successRate >= 60 && <li>• Good understanding of algorithms</li>}
                      {timeElapsed <= 1800 && <li>• Efficient time management</li>}
                      <li>• Clear code structure and organization</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {successRate < 60 && <li>• Focus on edge case handling</li>}
                      {successRate < 80 && <li>• Practice more algorithmic problems</li>}
                      {timeElapsed > 2400 && <li>• Work on time efficiency</li>}
                      <li>• Consider adding more comments to explain complex logic</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Next Steps</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Practice similar problems on coding platforms</li>
                      <li>• Review data structures and algorithms</li>
                      <li>• Focus on optimizing time and space complexity</li>
                      <li>• Work on explaining your thought process clearly</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Continue Interview
            </Button>
            <Button onClick={handleFinish} className="flex-1">
              Finish & Exit
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};