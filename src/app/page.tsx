"use client";

import React, { useState } from 'react';
import { Send, ArrowUp, Github, Link, Settings } from 'lucide-react';
import { AssistantMessage, UserMessage } from '../components/ui/Glass';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import { LogoMinimal } from '../components/ui/Logo';

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant' as const,
      content: 'Hi! I\'m neoneo, your AI assistant. Ask me anything about your app, code, or technical questions.',
    },
  ]);

    const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    setIsTyping(false);
    
    // Add user message to chat
    const userMessageId = Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        type: 'user' as const,
        content: userMessage,
      },
    ]);

    try {
      // Add typing indicator
      setIsTyping(true);
      
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          sources: sources,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Remove typing indicator and add AI response
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant' as const,
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant' as const,
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return (
      <div className="space-y-4 text-text-primary">
        {paragraphs.map((paragraph, index) => {
          if (paragraph.trim() === '') return null;
          
          // Check if it's a list item
          if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
            return (
              <div key={index} className="bg-background/20 border border-white/10 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-text-primary/90">
                  {paragraph.split('\n').map((item, itemIndex) => {
                    const cleanItem = item.replace(/^[-•]\s*/, '').trim();
                    if (cleanItem) {
                      return <li key={itemIndex} className="leading-relaxed text-base">{cleanItem}</li>;
                    }
                    return null;
                  })}
                </ul>
              </div>
            );
          }
          
          // Check if it's a numbered list
          if (/^\d+\./.test(paragraph.trim())) {
            return (
              <div key={index} className="bg-background/20 border border-white/10 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-text-primary/90">
                  {paragraph.split('\n').map((item, itemIndex) => {
                    const cleanItem = item.replace(/^\d+\.\s*/, '').trim();
                    if (cleanItem) {
                      return <li key={itemIndex} className="leading-relaxed">{cleanItem}</li>;
                    }
                    return null;
                  })}
                </ol>
              </div>
            );
          }
          
          // Check if it's a code block
          if (paragraph.includes('```') || paragraph.startsWith('    ') || paragraph.startsWith('\t')) {
            return (
              <div key={index} className="bg-background/40 border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-text-primary/60 ml-2">Code</span>
                </div>
                <pre className="overflow-x-auto">
                  <code className="text-text-primary/90 font-mono text-sm leading-relaxed">
                    {paragraph.replace(/```/g, '').trim()}
                  </code>
                </pre>
              </div>
            );
          }
          
          // Check if it's a heading
          if (paragraph.startsWith('# ')) {
            return (
              <div key={index} className="bg-gradient-to-r from-background/30 to-background/10 border-l-4 border-blue-500 rounded-r-lg p-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {paragraph.replace('# ', '')}
                </h3>
              </div>
            );
          }
          
          if (paragraph.startsWith('## ')) {
            return (
              <div key={index} className="bg-background/20 border-l-4 border-green-500 rounded-r-lg p-3">
                <h4 className="text-base font-semibold text-text-primary/90">
                  {paragraph.replace('## ', '')}
                </h4>
              </div>
            );
          }
          
          // Check if it's a file reference (contains file paths)
          if (paragraph.includes('.js') || paragraph.includes('.ts') || paragraph.includes('.tsx') || 
              paragraph.includes('.jsx') || paragraph.includes('.py') || paragraph.includes('.go') ||
              paragraph.includes('.rs') || paragraph.includes('.java') || paragraph.includes('.cpp') ||
              paragraph.includes('.c') || paragraph.includes('.php') || paragraph.includes('.md')) {
            return (
              <div key={index} className="bg-background/20 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-400 font-mono">File Reference</span>
                </div>
                <p className="text-text-primary/90 leading-relaxed font-mono text-sm">
                  {paragraph}
                </p>
              </div>
            );
          }
          
          // Check if it's a quote or important note
          if (paragraph.startsWith('> ') || paragraph.startsWith('Note:') || paragraph.startsWith('Important:')) {
            return (
              <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-text-primary/90 leading-relaxed italic">
                    {paragraph.replace(/^[>Note:Important:]\s*/, '')}
                  </p>
                </div>
              </div>
            );
          }
          
          // Regular paragraph with better styling
          return (
            <div key={index} className="bg-background/10 border border-white/5 rounded-lg p-4">
              <p className="text-text-primary leading-relaxed">
                {paragraph}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const handleLoadGitHubSource = async () => {
    const url = prompt('Enter GitHub repository URL:');
    if (!url) return;
    
    setIsLoadingSource(true);
    try {
      const response = await fetch('/api/sources/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to load repository');
      }

      const data = await response.json();
      setSources(prev => [...prev, data.source]);
      
      // Add a message to the chat about the loaded source
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant' as const,
          content: `✅ Successfully loaded ${data.source.name}! I can now help you understand this codebase. Ask me anything about the code, architecture, or functionality.`,
        },
      ]);
    } catch (error) {
      console.error('Error loading GitHub source:', error);
      alert('Failed to load repository. Please check the URL and try again.');
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleLoadUrlSource = async () => {
    const url = prompt('Enter URL to analyze:');
    if (!url) return;
    
    setIsLoadingSource(true);
    try {
      const response = await fetch('/api/sources/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to load URL content');
      }

      const data = await response.json();
      setSources(prev => [...prev, data.source]);
      
      // Add a message to the chat about the loaded source
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant' as const,
          content: `✅ Successfully loaded content from ${data.source.name}! I can now help you understand this content. Ask me anything about the information, structure, or details.`,
        },
      ]);
    } catch (error) {
      console.error('Error loading URL source:', error);
      alert('Failed to load URL content. Please check the URL and try again.');
    } finally {
      setIsLoadingSource(false);
    }
  };

  const removeSource = (sourceId: string) => {
    const sourceToRemove = sources.find(s => s.id === sourceId);
    setSources(prev => prev.filter(s => s.id !== sourceId));
    
    if (sourceToRemove) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'assistant' as const,
          content: `✅ Removed source: ${sourceToRemove.name}`,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm pb-0 -mb-4">
        <div className="flex items-center justify-center max-w-4xl mx-auto relative">
          <div className="relative group">
            {/* Gradient laser effects */}
            <div className="absolute inset-0 -m-4 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
              {/* Top laser - wavy */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-20">
                <svg width="2" height="80" viewBox="0 0 2 80" className="w-full h-full">
                  <path d="M1 0 Q1.5 20 1 40 Q0.5 60 1 80" stroke="url(#greenGradient)" strokeWidth="2" fill="none" className="animate-pulse">
                    <defs>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#5EE1A9" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </path>
                </svg>
              </div>
              {/* Bottom laser - wavy */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-20">
                <svg width="2" height="80" viewBox="0 0 2 80" className="w-full h-full">
                  <path d="M1 80 Q1.5 60 1 40 Q0.5 20 1 0" stroke="url(#blueGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#8AB4F8" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </path>
                </svg>
              </div>
            </div>
            
            <LogoMinimal size={80} className="group-hover:animate-pulse group-hover:drop-shadow-glow transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            msg.type === 'assistant' ? (
              <AssistantMessage key={msg.id}>
                {formatMessageContent(msg.content)}
              </AssistantMessage>
            ) : (
              <UserMessage key={msg.id}>
                <div className="text-text-primary leading-relaxed">
                  {msg.content}
                </div>
              </UserMessage>
            )
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <AssistantMessage>
              <div className="flex items-center gap-2 text-text-primary/80">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-sm">neoneo is thinking...</span>
              </div>
            </AssistantMessage>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Reply to neoneo..."
              className="flex-1 px-4 py-3 bg-background/50 border border-white/6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 text-text-primary placeholder-text-secondary backdrop-blur-sm hover:bg-background/70 focus:bg-background/70 focus:border-green-400 focus:shadow-glow"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="w-12 h-12 bg-background/30 text-text-primary rounded-full hover:bg-background/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-white/6 backdrop-blur-sm transition-colors duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-12 h-12 bg-background/30 text-text-primary rounded-full hover:bg-background/70 flex items-center justify-center border border-white/6 backdrop-blur-sm transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-background/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-text-primary/80 mb-3">Source Management</h3>
                  
                  <button
                    onClick={handleLoadGitHubSource}
                    disabled={isLoadingSource}
                    className="w-full flex items-center gap-3 px-3 py-2 bg-background/30 text-text-primary rounded-lg hover:bg-background/50 disabled:opacity-50 disabled:cursor-not-allowed border border-white/6 backdrop-blur-sm transition-colors duration-200"
                  >
                    {isLoadingSource ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Github className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isLoadingSource ? 'Loading...' : 'Add GitHub Source'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleLoadUrlSource}
                    disabled={isLoadingSource}
                    className="w-full flex items-center gap-3 px-3 py-2 bg-background/30 text-text-primary rounded-lg hover:bg-background/50 disabled:opacity-50 disabled:cursor-not-allowed border border-white/6 backdrop-blur-sm transition-colors duration-200"
                  >
                    {isLoadingSource ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Link className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isLoadingSource ? 'Loading...' : 'Add URL Source'}
                    </span>
                  </button>
                  
                  {sources.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-text-primary/60 mb-2">
                        Loaded Sources ({sources.length}):
                      </div>
                      <div className="space-y-2">
                        {sources.map((source) => (
                          <div key={source.id} className="flex items-center justify-between p-2 bg-background/20 rounded border border-white/5">
                            <div className="flex items-center gap-2">
                              {source.type === 'github' ? (
                                <Github className="w-3 h-3 text-text-primary/60" />
                              ) : (
                                <Link className="w-3 h-3 text-text-primary/60" />
                              )}
                              <span className="text-xs text-text-primary/80 truncate max-w-48">
                                {source.name}
                              </span>
                            </div>
                            <button
                              onClick={() => removeSource(source.id)}
                              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}