import { Editor } from '@monaco-editor/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  onSubmit?: () => void;
  language: string;
  isRunning?: boolean;
  canSubmit?: boolean;
}

export const CodeEditor = ({ 
  code, 
  onChange, 
  onRun, 
  onReset, 
  onSubmit,
  language, 
  isRunning = false,
  canSubmit = false
}: CodeEditorProps) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
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
          {onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={!canSubmit}
              variant="outline"
              size="sm"
              className={`${
                canSubmit 
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700' 
                  : 'border-muted text-muted-foreground cursor-not-allowed'
              }`}
              title={canSubmit ? 'Submit current problem' : 'Run code first to enable submit'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};