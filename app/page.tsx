"use client";

import { ChatMain } from "@/components/chat/chat-main";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Github } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 h-14 bg-background z-20">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Spam/Ham Detector
          </h1>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href="https://github.com/ln-dev7/square-ui/tree/master/templates/chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <GridPattern className="pointer-events-none" />

          <div className="relative z-10 h-full">
            <ChatMain />
          </div>
        </div>
      </div>
    </div>
  );
}
