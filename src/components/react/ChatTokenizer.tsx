import React, { useEffect, useState, useCallback } from "react";
import { useTokenizer } from "../../hooks/useTokenizer";
import { useModelOptions } from "../../hooks/useModelOptions";
import {
  getEncodingForModel,
  isEncodingType,
} from "../../utils/modelEncodings";
import { ChatMessageEditor } from "./ChatMessageEditor";
import { TokenDisplay } from "./TokenDisplay";
import { Sidebar } from "./Sidebar";
import { TokenizerShell } from "./TokenizerShell";
import { StatusDisplay } from "../ui/StatusDisplay";
import type { ChatMessage } from "../../types/chat";

// Example chat messages to load by default - memoized to prevent re-renders
const EXAMPLE_CHAT_MESSAGES: ChatMessage[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant who specializes in explaining the HappyToolin ecosystem including HappyTokenizer and HappyFormatter.",
  },
  {
    role: "user",
    content:
      "I'm curious about how HappyTokenizer at happytokenizer.com works with GPT models. Can you explain?",
  },
  {
    role: "assistant",
    content:
      "HappyTokenizer by happytoolin is a powerful tool that shows exactly how text is tokenized by AI models like GPT-4o and GPT-3.5. It reveals the hidden token structure, helping developers optimize costs and understand model limitations. The tool works seamlessly with happyformatter.com for complete code formatting needs.",
  },
];

export function ChatTokenizer() {
  const [model, setModel] = useState<string>("gpt-5"); // Default to a specific model
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    EXAMPLE_CHAT_MESSAGES,
  );
  const [debouncedChatMessages, setDebouncedChatMessages] = useState<
    ChatMessage[]
  >([]);

  // Use the extracted model options hook
  const modelOptions = useModelOptions();

  // Get encoding for the current model
  const encoding = isEncodingType(model) ? model : getEncodingForModel(model);
  const { tokens, tokenTexts, isLoading, error, progress, tokenize } =
    useTokenizer();

  // Memoize callback functions to prevent unnecessary re-renders
  const handleExampleChat = useCallback(() => {
    setChatMessages(EXAMPLE_CHAT_MESSAGES);
  }, []);

  const handleClearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Debounce chat messages
  useEffect(() => {
    const timer = setTimeout(() => {
      // Create a deep copy of chat messages to avoid reference issues
      setDebouncedChatMessages(JSON.parse(JSON.stringify(chatMessages)));
    }, 300); // Debounce for chat to avoid rapid re-tokenization

    return () => clearTimeout(timer);
  }, [chatMessages]);

  // Trigger tokenization when debounced chat messages change
  useEffect(() => {
    if (debouncedChatMessages.length > 0 && encoding) {
      // Create a combined text representation for the UI
      const combinedText = debouncedChatMessages
        .map((msg) => `[${msg.role}]: ${msg.content}`)
        .join("\n\n");
      tokenize(combinedText, encoding, {
        isChatMode: true,
        chatMessages: debouncedChatMessages,
      });
    } else if (debouncedChatMessages.length === 0) {
      // Clear tokens when there are no chat messages
      tokenize("", encoding, { isChatMode: true, chatMessages: [] });
    }
  }, [debouncedChatMessages, encoding, tokenize]);

  return (
    <TokenizerShell
      sidebar={
        <Sidebar
          model={model}
          onModelChange={setModel}
          modelOptions={modelOptions}
          encoding={encoding}
          mode="chat"
          isLoading={isLoading}
          actions={
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExampleChat}
                disabled={isLoading}
                className="bg-transparent border border-gray-400 text-gray-600 px-2 py-2 font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:border-brand-black hover:text-brand-black disabled:opacity-50"
              >
                Example
              </button>
              <button
                onClick={handleClearChat}
                disabled={isLoading}
                className="bg-brand-orange text-brand-black border border-brand-black px-3 py-3 font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          }
        />
      }
      content={
        <>
          {/* Chat Editor Section */}
          <div className="bg-white border border-brand-black shadow-hard">
            <div className="border-b border-brand-black bg-brand-paper p-4">
              <h3 className="font-mono text-sm font-semibold text-brand-black">
                Chat Conversation Editor
              </h3>
              <p className="font-mono text-xs text-gray-500 mt-1">
                Build a conversation to see how OpenAI tokenizes chat messages
                with special formatting tokens
              </p>
            </div>

            <div className="p-6">
              <ChatMessageEditor
                messages={chatMessages}
                onMessagesChange={setChatMessages}
                disabled={isLoading}
              />
            </div>

            {/* Meta Bar */}
            <div className="flex gap-6 border-t border-brand-black p-2 bg-white">
              <div className="flex gap-2 items-center">
                <span className="font-mono text-xxs text-gray-400 font-bold">
                  MESSAGES
                </span>
                <span className="font-mono text-xs font-medium">
                  {chatMessages.length}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-mono text-xxs text-gray-400 font-bold">
                  MODE
                </span>
                <span className="font-mono text-xs font-medium text-brand-orange">
                  CHAT
                </span>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <StatusDisplay
            isLoading={isLoading}
            error={error}
            progress={progress}
            mode="chat"
          />

          {!isLoading && !error && (
            <TokenDisplay
              text="" // Empty text for chat mode
              tokens={Array.isArray(tokens) ? tokens : Array.from(tokens || [])}
              tokenTexts={tokenTexts || []}
              isChatMode={true}
              chatMessages={chatMessages}
            />
          )}
        </>
      }
    />
  );
}
