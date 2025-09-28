import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  Clock, 
  Code, 
  CheckCircle, 
  XCircle, 
  Target,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { InterviewStatsService, InterviewSession } from '@/services/interviewStats';
import { motion } from 'framer-motion';

interface InterviewHistoryProps {
  onSessionSelect?: (session: InterviewSession) => void;
}

export const InterviewHistory = ({ onSessionSelect }: InterviewHistoryProps) => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = InterviewStatsService.getAllSessions();
    const sessionsSummary = InterviewStatsService.getSessionsSummary();
    setSessions(allSessions);
    setSummary(sessionsSummary);
  };

  const handleExportAll = () => {
    InterviewStatsService.exportAllSessions();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all interview sessions? This action cannot be undone.')) {
      InterviewStatsService.clearAllSessions();
      loadSessions();
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { variant: 'default' as const, className: 'bg-green-500', label: 'Excellent' };
    if (score >= 50) return { variant: 'secondary' as const, className: 'bg-yellow-500', label: 'Good' };
    return { variant: 'destructive' as const, className: 'bg-red-500', label: 'Needs Improvement' };
  };

  if (!summary) {
    return <div className="p-4">Loading interview history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interview Statistics Overview</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.completedSessions}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.abandonedSessions}</div>
              <div className="text-sm text-gray-600">Abandoned</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{summary.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatDuration(summary.averageDuration)}</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interview Sessions ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No interview sessions recorded yet.</p>
              <p className="text-sm">Sessions will appear here after candidates complete interviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{session.candidateName}</div>
                            <div className="text-sm text-gray-600">{session.candidateEmail}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(session.performance.overallScore)}`}>
                              {session.performance.overallScore}%
                            </div>
                            <Badge 
                              variant={getScoreBadge(session.performance.overallScore).variant}
                              className={getScoreBadge(session.performance.overallScore).className}
                            >
                              {getScoreBadge(session.performance.overallScore).label}
                            </Badge>
                          </div>
                          
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(session.timestamp)}
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDuration(session.duration)}
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSession(session);
                              onSessionSelect?.(session);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <Code className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-sm font-semibold">{session.performance.codeExecutions}</div>
                          <div className="text-xs text-gray-600">Code Runs</div>
                        </div>
                        <div className="text-center">
                          <Target className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <div className="text-sm font-semibold">
                            {session.performance.problemsSolved}/{session.performance.problemsAttempted}
                          </div>
                          <div className="text-xs text-gray-600">Problems Solved</div>
                        </div>
                        <div className="text-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <div className="text-sm font-semibold">{session.performance.testsPassed}</div>
                          <div className="text-xs text-gray-600">Tests Passed</div>
                        </div>
                        <div className="text-center">
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Detail Modal */}
      {selectedSession && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Session Details: {selectedSession.candidateName}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedSession(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Problems Attempted */}
            <div>
              <h4 className="font-semibold mb-3">Problems Attempted</h4>
              <div className="space-y-3">
                {selectedSession.problems.map((problem, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium">{problem.title}</h5>
                          <Badge variant="secondary">{problem.difficulty}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {problem.solved ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm">{formatDuration(problem.timeSpent)}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Test Results: {problem.testResults.filter(t => t.passed).length}/{problem.testResults.length} passed
                      </div>
                      
                      <Progress 
                        value={(problem.testResults.filter(t => t.passed).length / problem.testResults.length) * 100} 
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Strengths</h4>
                <ul className="space-y-2">
                  {selectedSession.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-yellow-600">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {selectedSession.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center space-x-2 text-yellow-700">
                      <Target className="w-4 h-4" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};