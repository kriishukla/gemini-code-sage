import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lightbulb, Activity, CheckCircle } from 'lucide-react';

interface AnalysisResult {
  complexity: string;
  quality: string;
  suggestions: string[];
  errors: string[];
}

interface AnalysisPopupProps {
  analysis: AnalysisResult | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export const AnalysisPopup = ({ analysis, isOpen, onOpenChange, children }: AnalysisPopupProps) => {
  if (!analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Code Analysis Results
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of your code implementation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Complexity and Quality Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 border border-border rounded-lg bg-card/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-semibold text-foreground">Complexity</h4>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.complexity}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border border-border rounded-lg bg-card/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-semibold text-foreground">Quality</h4>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.quality}</p>
            </motion.div>
          </div>

          {/* Issues Found */}
          {analysis.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 border border-red-200 rounded-lg bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">Issues Found</h4>
                <Badge variant="destructive" className="text-xs">
                  {analysis.errors.length}
                </Badge>
              </div>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-2">
                {analysis.errors.map((error, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 border border-yellow-200 rounded-lg bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Suggestions</h4>
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {analysis.suggestions.length}
                </Badge>
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-yellow-500 mt-0.5">→</span>
                    <span>{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Success Message if no issues */}
          {analysis.errors.length === 0 && analysis.suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 border border-green-200 rounded-lg bg-green-50/50 dark:border-green-800 dark:bg-green-950/50 text-center"
            >
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                Great Work!
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your code looks good with no major issues detected.
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisPopup;