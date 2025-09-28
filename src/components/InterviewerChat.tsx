import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Lightbulb, Mic, MicOff, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'hint' | 'analysis' | 'question';
}

interface InterviewerChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isThinking?: boolean;
  currentHints?: string[];
}

export const InterviewerChat = ({ 
  messages, 
  onSendMessage, 
  isThinking = false,
  currentHints = []
}: InterviewerChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio recording functionality
  const audioRecorder = useAudioRecorder({
    onTranscriptionStart: () => {
      console.log('Transcription started...');
    },
    onTranscriptionComplete: (text: string) => {
      console.log('Transcription completed:', text);
      setNewMessage(text);
    },
    onTranscriptionError: (error: string) => {
      console.error('Transcription error:', error);
      // You might want to show a toast or alert here
    }
  });

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM updates are complete before scrolling
    // and use requestAnimationFrame for smoother scrolling
    setTimeout(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      });
    }, 150);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when thinking state changes
  useEffect(() => {
    if (isThinking) {
      scrollToBottom();
    }
  }, [isThinking]);

  // Auto-scroll when hints change
  useEffect(() => {
    if (currentHints.length > 0) {
      scrollToBottom();
    }
  }, [currentHints]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-lg">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-primary to-primary/80">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">CodeSage AI</h3>
            <p className="text-xs text-muted-foreground">Technical Interviewer</p>
          </div>
        </div>
        
        <div className="ml-auto">
          <Badge variant="outline" className="text-xs">
            {isThinking ? 'Thinking...' : 'Ready'}
          </Badge>
        </div>
      </div>

      {/* Messages Container with Independent Scrolling */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin smooth-scroll">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-secondary' 
                    : 'bg-gradient-to-r from-primary to-primary/80'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'hint' && (
                      <div className="flex items-center gap-2 mb-2 text-status-hint">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs font-medium">Hint</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking Indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm">CodeSage is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Hints */}
          {currentHints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-border/50 pt-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-status-hint" />
                <span className="text-sm font-medium text-status-hint">Available Hints</span>
              </div>
              <div className="space-y-2">
                {currentHints.map((hint, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSendMessage(`Can you give me a hint about: ${hint}`)}
                    className="text-left justify-start h-auto p-3 text-sm text-muted-foreground hover:text-foreground w-full"
                  >
                    💡 {hint}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-border/50 bg-card/50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={audioRecorder.isRecording 
                ? "Recording audio..." 
                : audioRecorder.isTranscribing 
                  ? "Transcribing..." 
                  : "Ask questions, explain your approach, or request hints..."}
              className="flex-1 pr-12"
              disabled={isThinking || audioRecorder.isRecording || audioRecorder.isTranscribing}
            />
            
            {/* Recording duration indicator */}
            {audioRecorder.isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-red-500 text-sm"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {Math.floor(audioRecorder.duration / 60)}:{(audioRecorder.duration % 60).toString().padStart(2, '0')}
              </motion.div>
            )}
          </div>
          
          {/* Microphone button */}
          <Button
            onClick={audioRecorder.isRecording ? audioRecorder.stopRecording : audioRecorder.startRecording}
            disabled={isThinking || audioRecorder.isTranscribing}
            size="sm"
            variant={audioRecorder.isRecording ? "destructive" : "outline"}
            className={audioRecorder.isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "hover:bg-primary hover:text-primary-foreground"
            }
          >
            {audioRecorder.isRecording ? (
              <Square className="w-4 h-4" />
            ) : audioRecorder.isTranscribing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isThinking || audioRecorder.isRecording || audioRecorder.isTranscribing}
            size="sm"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Audio recording status */}
        {audioRecorder.isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-blue-600 flex items-center gap-2"
          >
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Converting speech to text...
          </motion.div>
        )}
      </div>
    </div>
  );
};