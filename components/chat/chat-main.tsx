"use client";

import { useState } from "react";
import { ChatWelcomeScreen } from "./chat-welcome-screen";
import { ChatConversationView } from "./chat-conversation-view";
import { AnalysisResult } from "./analysis-dashboard";
import { api } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatMain() {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("TF-IDF");
  const [selectedMLModel, setSelectedMLModel] = useState("logistic_regression");
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    performAnalysis(message);
    setMessage("");
  };

  const handleReset = () => {
    setIsConversationStarted(false);
    setMessages([]);
    setMessage("");
    setAnalysisResult(null);
  };

  const performAnalysis = async (text: string) => {
    setIsConversationStarted(true);
    setIsAnalyzing(true);

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Call API
    let result: AnalysisResult;
    try {
      result = await api.analyzeMessage(text);
    } catch (e) {
      result = {
        prediction: "HAM",
        confidence: 0,
        details: { tokens: ["Error"], vector: [] }
      };
    }

    setAnalysisResult(result);
    setIsAnalyzing(false);

    // Add AI Message
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: `Analysis complete. Result: **${result.prediction}** (${(result.confidence * 100).toFixed(1)}%).`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  if (isConversationStarted) {
    return (
      <ChatConversationView
        messages={messages}
        message={message}
        onMessageChange={setMessage}
        onSend={performAnalysis}
        onReset={handleReset}
        analysisResult={analysisResult}
        isAnalyzing={isAnalyzing}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        selectedMLModel={selectedMLModel}
        onMLModelChange={setSelectedMLModel}
      />
    );
  }

  return (
    <ChatWelcomeScreen
      message={message}
      onMessageChange={setMessage}
      onSend={handleSend}
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      selectedMLModel={selectedMLModel}
      onMLModelChange={setSelectedMLModel}
    />
  );
}
