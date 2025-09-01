"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2, MessageSquare, Upload, Github, Link, ThumbsUp, ThumbsDown, FileText, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  citations?: string[];
  diagram?: string;
  feedback?: "up" | "down" | null;
}

interface Source {
  id: string;
  type: "file" | "github" | "url";
  name: string;
  content?: string;
  url?: string;
  summary?: string;
  language?: string;
  fileType?: string;
  size?: number;
  files?: any[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm Layman. I can help you understand how your app works. Upload your codebase, share a GitHub repo, or just start asking questions!",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSourcePanel, setShowSourcePanel] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoadingSource, setIsLoadingSource] = useState(false);

  const roleExamples = [
    {
      role: "PM",
      icon: Zap,
      question: "What happens if we add loyalty tier to checkout?",
      description: "flows, APIs, dependencies, estimate"
    },
    {
      role: "Designer", 
      icon: FileText,
      question: "What data fills this screen?",
      description: "APIs, inputs/outputs, error states"
    },
    {
      role: "Support",
      icon: User,
      question: "Seat selection failed — why?",
      description: "traces flow, shows likely causes"
    }
  ];

  const handleFileUpload = async (files: FileList) => {
    setIsLoadingSource(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/sources/files', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setSources(prev => [...prev, ...data.sources]);
      } else {
        const error = await response.json();
        console.error("File upload error:", error.error);
      }
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    
    setIsLoadingSource(true);
    try {
      const response = await fetch('/api/sources/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSources(prev => [...prev, data.source]);
        setGithubUrl("");
      } else {
        const error = await response.json();
        console.error("GitHub fetch error:", error.error);
      }
    } catch (error) {
      console.error("GitHub fetch error:", error);
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    
    setIsLoadingSource(true);
    try {
      const response = await fetch('/api/sources/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSources(prev => [...prev, data.source]);
        setWebsiteUrl("");
      } else {
        const error = await response.json();
        console.error("URL fetch error:", error.error);
      }
    } catch (error) {
      console.error("URL fetch error:", error);
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
          sources: sources, // Send available sources for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
        citations: data.citations,
        diagram: data.diagram,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again or check your API configuration.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen lovable-gradient flex flex-col">
      {/* Simple Header */}
      <header className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Layman</h1>
          </div>
        </div>
      </header>

      {/* Hero Section - Lovable Style */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          {/* Title and Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Build something{" "}
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                🏗️
              </motion.span>{" "}
              Layman
            </h1>
            <p className="text-xl text-white/80 font-medium">
              Create apps and websites by chatting with AI
            </p>
          </motion.div>

          {/* Main Chat Input - Hero Style */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-container p-8 mb-8"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-4">
                {/* Source buttons - inline */}
                <div className="flex gap-2">
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    <Upload className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </motion.label>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = prompt("Enter GitHub repository URL:");
                      if (url) {
                        setGithubUrl(url);
                        handleGithubSubmit({ preventDefault: () => {} } as React.FormEvent);
                      }
                    }}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 text-white" />
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = prompt("Enter website URL:");
                      if (url) {
                        setWebsiteUrl(url);
                        handleUrlSubmit({ preventDefault: () => {} } as React.FormEvent);
                      }
                    }}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Link className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {/* Main input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Layman to create a landing page for..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60 text-lg"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: !input.trim() || isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: !input.trim() || isLoading ? 1 : 0.95 }}
                  className="px-6 py-4 rounded-2xl bg-white text-gray-900 font-semibold transition-all duration-200 flex items-center justify-center min-w-[60px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </form>

            {/* Source status indicator */}
            {sources.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-white/70 text-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {sources.length} source{sources.length !== 1 ? 's' : ''} connected
              </motion.div>
            )}

            {/* Loading indicator */}
            {isLoadingSource && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-white/70 text-sm"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading source...
              </motion.div>
            )}
          </motion.div>

          {/* Role Examples - Simplified */}
          {messages.length === 1 && sources.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {roleExamples.map((example, index) => (
                <motion.button
                  key={example.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(example.question)}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-left hover:bg-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <example.icon className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white text-sm">{example.role}</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    "{example.question}"
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Chat Messages - Only show when there are messages */}
          {messages.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-container mt-8 p-6"
            >
              <div className="max-h-96 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {messages.slice(1).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-gray-700" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-white text-gray-900"
                            : "bg-white/20 text-white border border-white/20"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.content}
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleFeedback(message.id, "up")}
                              className={`p-1 rounded transition-all duration-200 ${
                                message.feedback === "up" 
                                  ? "text-green-400" 
                                  : "text-white/50 hover:text-white/80"
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "down")}
                              className={`p-1 rounded transition-all duration-200 ${
                                message.feedback === "down" 
                                  ? "text-red-400" 
                                  : "text-white/50 hover:text-white/80"
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
