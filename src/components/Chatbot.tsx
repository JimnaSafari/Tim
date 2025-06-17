
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m TIM Assistant. How can I help you today? I can assist with batches, savings, loans, and payments.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('batch') || message.includes('group')) {
      return 'I can help with batches! You can create a new batch for 10 members with KES 1,100 contribution (KES 1,000 + KES 100 service fee). Each member gets their turn in order. Would you like to know more about creating or joining a batch?';
    }
    
    if (message.includes('loan')) {
      return 'For loans, you need to be active for at least 2 months. You can borrow up to 83% of your next payout amount. The loan is automatically deducted when you receive your payout. Check your eligibility in the Loans section!';
    }
    
    if (message.includes('savings') || message.includes('save')) {
      return 'Great question about savings! You can save money anytime and request withdrawals with 48-hour processing time. Funds are sent to your registered M-PESA number. Your savings also affect your loan eligibility!';
    }
    
    if (message.includes('payment') || message.includes('mpesa')) {
      return 'All payments are processed through M-PESA to your registered phone number. The service fee is KES 100 per contribution. Make sure your M-PESA number matches your registration details!';
    }
    
    if (message.includes('fee') || message.includes('cost')) {
      return 'The service fee is KES 100 per contribution of KES 1,100. This fee helps maintain the app and ensures secure transactions. So total contribution is KES 1,100 (KES 1,000 for the pool + KES 100 service fee).';
    }
    
    if (message.includes('help') || message.includes('how')) {
      return 'I can help you with:\n• Creating or joining batches\n• Understanding loan eligibility\n• Managing savings and withdrawals\n• Payment and M-PESA issues\n• Service fees and costs\n\nWhat would you like to know more about?';
    }
    
    return 'I understand you\'re asking about TIM services. I can help with batches, loans, savings, and payments. Could you be more specific about what you need help with?';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full gradient-primary text-white shadow-lg z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 top-20 z-50 flex flex-col max-w-sm mx-auto">
          <Card className="glassmorphism border-0 flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">TIM Assistant</h3>
                  <p className="text-xs text-green-400">● Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-500' 
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className={`max-w-xs ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'glassmorphism-dark text-gray-100'
                    }`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="gradient-primary text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot;
