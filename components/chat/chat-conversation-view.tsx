import { Button } from "@/components/ui/button";
import { XIcon, Loader2 } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { AnalysisDashboard, AnalysisResult } from "./analysis-dashboard";
import { useEffect, useRef } from "react";
import { ChatInputBox } from "./chat-input-box";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatConversationViewProps {
  messages: Message[];
  message: string;
  onMessageChange: (value: string) => void;
  onSend: (content: string) => void;
  onReset: () => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  selectedMLModel: string;
  onMLModelChange: (modelId: string) => void;
}

export function ChatConversationView({
  messages,
  message,
  onMessageChange,
  onSend,
  onReset,
  analysisResult,
  isAnalyzing,
  selectedModel,
  onModelChange,
  selectedMLModel,
  onMLModelChange,
}: ChatConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, analysisResult, isAnalyzing]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8" ref={scrollRef}>
        <div className="max-w-[700px] mx-auto space-y-6">
          <div className="flex justify-end mb-2">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={onReset}
              className="size-8 rounded-full border"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-muted-foreground p-4">
              <Loader2 className="animate-spin size-4" />
              <span className="text-sm">Analyzing content...</span>
            </div>
          )}

          {/* Show Dashboard only if we have a result and not analyzing */}
          {!isAnalyzing && analysisResult && (
            <AnalysisDashboard result={analysisResult} />
          )}
        </div>
      </div>

      <div className="border-t border-border px-4 md:px-8 py-[17px]">
        <div className="max-w-[640px] mx-auto">
          <ChatInputBox
            message={message}
            onMessageChange={onMessageChange}
            onSend={() => onSend(message)}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            selectedMLModel={selectedMLModel}
            onMLModelChange={onMLModelChange}
            showTools={true}
            placeholder={isAnalyzing ? "Analyzing..." : "Type a message to analyze..."}
          />
        </div>
      </div>
    </div>
  );
}

