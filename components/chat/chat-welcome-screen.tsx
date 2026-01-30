import Image from "next/image";
import { ChatInputBox } from "./chat-input-box";

interface ChatWelcomeScreenProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  selectedMLModel: string;
  onMLModelChange: (modelId: string) => void;
}

export function ChatWelcomeScreen({
  message,
  onMessageChange,
  onSend,
  selectedModel,
  onModelChange,
  selectedMLModel,
  onMLModelChange,
}: ChatWelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 md:px-8">
      <div className="w-full max-w-[640px] space-y-9 -mt-12">
        <div className="flex justify-center">
          <div className="relative size-24 md:size-32">
            <Image
              src="/ispm.png"
              alt="ISPM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Classification SPAM / HAM
          </h1>
          <p className="text-xl text-muted-foreground">
            ISPM - Travaux Pratiques de Machine Learning
          </p>
        </div>

        <ChatInputBox
          message={message}
          onMessageChange={onMessageChange}
          onSend={onSend}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          selectedMLModel={selectedMLModel}
          onMLModelChange={onMLModelChange}
          showTools={true}
        />

      </div>

      <div className="absolute bottom-6 text-center">
        <p className="text-sm text-muted-foreground">
          Développé pour le cours de TALN
        </p>
      </div>
    </div>
  );
}

