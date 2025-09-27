import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col h-full max-h-full">
      <Card className="flex flex-col h-full bg-gradient-to-br from-card to-card/80 border-border/50">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-border/50 bg-card">
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

        {/* Messages Container - This is the key change */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 space-y-4">
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
                  className="text-left justify-start h-auto p-3 text-sm text-muted-foreground hover:text-foreground"
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
        <div className="flex-shrink-0 p-4 border-t border-border/50 bg-card">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask questions, explain your approach, or request hints..."
              className="flex-1"
              disabled={isThinking}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || isThinking}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};