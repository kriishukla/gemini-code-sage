import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewInterface } from '@/components/InterviewInterface';
import { PerformanceSummary } from '@/components/PerformanceSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Clock, Code2, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const CandidatePortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showPerformanceSummary, setShowPerformanceSummary] = useState(false);

  // Track session duration
  useEffect(() => {
    if (!user) return;
    
    const startTime = new Date(user.loginTime).getTime();
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const duration = Math.floor((currentTime - startTime) / 1000);
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const handleLogout = () => {
    setShowPerformanceSummary(true);
  };

  const handlePerformanceSummaryClose = () => {
    setShowPerformanceSummary(false);
    logout();
    navigate('/');
  };

  const formatSessionDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Candidate Portal</h1>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Candidate
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Session Duration
              </div>
              <div className="font-mono">{formatSessionDuration(sessionDuration)}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome to your coding interview!
            </h2>
          </div>
          <p className="text-gray-600">
            You're now in the interactive coding environment. Use the AI interviewer to get guidance, 
            solve problems step by step, and showcase your programming skills. Good luck! 🚀
          </p>
        </motion.div>
      </div>

      {/* Interview Interface */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <InterviewInterface />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Summary Modal */}
      {showPerformanceSummary && (
        <PerformanceSummary
          isOpen={showPerformanceSummary}
          onClose={handlePerformanceSummaryClose}
          sessionData={{
            duration: sessionDuration,
            email: user.email,
            loginTime: user.loginTime
          }}
        />
      )}
    </div>
  );
};

export default CandidatePortal;