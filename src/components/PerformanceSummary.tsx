import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Star
} from 'lucide-react';

interface PerformanceSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    duration: number; // in seconds
    email: string;
    loginTime: string;
  };
}

export const PerformanceSummary = ({ isOpen, onClose, sessionData }: PerformanceSummaryProps) => {
  // Static performance data for consistent display
  const performanceData = {
    overallScore: 41, // Static: 41%
    strengths: ['Problem comprehension', 'Code structure', 'Communication'],
    improvements: ['Algorithm optimization', 'Edge case handling', 'Time complexity analysis']
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { variant: 'default' as const, className: 'bg-green-100 text-green-700', label: 'Excellent' };
    if (score >= 50) return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700', label: 'Good' };
    return { variant: 'destructive' as const, className: 'bg-red-100 text-red-700', label: 'Needs Improvement' };
  };

  const scoreBadge = getScoreBadge(performanceData.overallScore);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl">Session Complete!</DialogTitle>
          <DialogDescription className="text-lg">
            Here's a summary of your coding interview performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border"
          >
            <div className="text-4xl font-bold mb-2">
              <span className={getScoreColor(performanceData.overallScore)}>
                {performanceData.overallScore}%
              </span>
            </div>
            <Badge className={scoreBadge.className} variant={scoreBadge.variant}>
              {scoreBadge.label}
            </Badge>
            <p className="text-gray-600 mt-2">Overall Performance Score</p>
          </motion.div>





          {/* Strengths and Areas for Improvement */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {performanceData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-700">
                    <Star className="w-4 h-4 fill-current" />
                    {strength}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-700">
                <TrendingUp className="w-5 h-5" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {performanceData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center gap-2 text-yellow-700">
                    <TrendingUp className="w-4 h-4" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center pt-4"
          >
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              size="lg"
            >
              Return to Home
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Thank you for using Gemini Code Sage!
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceSummary;