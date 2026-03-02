'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi Alex! I\'m your DropAI assistant. How can I help you find winning products today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg = { 
        role: 'bot', 
        text: `Based on current trends, I recommend looking into "Eco-friendly Home Decor" in the UK market. Demand is up 15% this week!` 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="w-80 md:w-96 bg-card border-border shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-primary-foreground flex items-center gap-2">
                  <Bot className="w-4 h-4" /> DropAI Assistant
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        msg.role === 'bot' ? "bg-primary" : "bg-muted"
                      )}>
                        {msg.role === 'bot' ? <Bot className="w-4 h-4 text-primary-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl text-xs leading-relaxed",
                        msg.role === 'bot' ? "bg-card text-foreground border border-border" : "bg-primary text-primary-foreground"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input 
                    placeholder="Ask anything..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="bg-muted/50 border-border text-xs h-9"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "bg-muted rotate-90 text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}
