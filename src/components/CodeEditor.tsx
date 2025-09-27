import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  language: string;
  analysis?: {
    complexity: string;
    quality: string;
    suggestions: string[];
    errors: string[];
  };
  isRunning?: boolean;
}

export const CodeEditor = ({ 
  code, 
  onChange, 
  onRun, 
  onReset, 
  language, 
  analysis, 
  isRunning = false 
}: CodeEditorProps) => {
  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Code Editor</h3>
          <Badge variant="secondary" className="text-xs">
            {language}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onRun}
            disabled={isRunning}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            selectionHighlight: false,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>

      {/* Analysis Panel */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border/50 p-4 bg-muted/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Complexity</h4>
              <p className="text-sm text-muted-foreground">{analysis.complexity}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Quality</h4>
              <p className="text-sm text-muted-foreground">{analysis.quality}</p>
            </div>
          </div>

          {analysis.errors.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-status-error mb-2">Issues Found</h4>
              <ul className="text-sm text-status-error space-y-1">
                {analysis.errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-status-error">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-status-hint mb-2">Suggestions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-status-hint">→</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </Card>
  );
};