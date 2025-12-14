import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ComboboxShadcn,
  type ComboboxOption,
} from "../../components/ui/combobox-shadcn";
import { useTokenizer } from "../../hooks/useTokenizer";
import {
  getEncodingForModel,
  isEncodingType,
  MODEL_DISPLAY_NAMES,
  MODEL_ENCODINGS,
} from "../../utils/modelEncodings";
import { ChatMessageEditor } from "./ChatMessageEditor";
import { TokenDisplay } from "./TokenDisplay";
import { Sidebar } from "./Sidebar";
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

  // Generate combobox options from model encodings - memoized to prevent re-renders
  const modelOptions = useMemo(() => {
    const options: ComboboxOption[] = [];

    // Define group names without emojis and encoding details
    const groupNames: Record<string, string> = {
      o200k_base: "Modern Models",
      cl100k_base: "Chat Models",
      p50k_base: "Completion Models",
      p50k_edit: "Edit Models",
      r50k_base: "Legacy Models",
      o200k_harmony: "OpenAI OSS",
    };

    // Group specific models for better organization
    const specialGroups: Record<
      string,
      { models: string[]; groupName: string }
    > = {
      search: {
        models: [
          "text-search-ada-doc-001",
          "text-search-ada-query-001",
          "text-search-babbage-doc-001",
          "text-search-babbage-query-001",
          "text-search-curie-doc-001",
          "text-search-curie-query-001",
          "text-search-davinci-doc-001",
          "text-search-davinci-query-001",
        ],
        groupName: "Search & Similarity",
      },
      similarity: {
        models: [
          "text-similarity-ada-001",
          "text-similarity-babbage-001",
          "text-similarity-curie-001",
          "text-similarity-davinci-001",
        ],
        groupName: "Search & Similarity",
      },
      audioMedia: {
        models: [
          "whisper-1",
          "tts-1",
          "tts-1-hd",
          "dall-e-2",
          "dall-e-3",
          "gpt-audio",
          "gpt-audio-mini",
          "sora-2",
          "sora-2-pro",
        ],
        groupName: "Audio & Media",
      },
      codeSearch: {
        models: [
          "code-search-ada-code-001",
          "code-search-ada-text-001",
          "code-search-babbage-code-001",
          "code-search-babbage-text-001",
        ],
        groupName: "Legacy Models",
      },
    };

    // Process models by encoding type
    Object.entries(MODEL_ENCODINGS).forEach(([encoding, models]) => {
      if (encoding === "r50k_base") {
        // For r50k_base, we need to handle special grouping
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];
          let isInSpecialGroup = false;

          // Check if model belongs to a special group
          Object.entries(specialGroups).forEach(([key, group]) => {
            if (group.models.includes(modelName)) {
              groupName = group.groupName;
              isInSpecialGroup = true;
            }
          });

          // Only add if not already in a special group
          if (!isInSpecialGroup) {
            options.push({
              value: modelName,
              label: MODEL_DISPLAY_NAMES[modelName] || modelName,
              group: groupName,
            });
          }
        });

        // Add special groups
        Object.values(specialGroups).forEach((group) => {
          if (
            group.groupName.includes("Search") ||
            group.groupName.includes("Similarity") ||
            group.groupName.includes("Code") ||
            group.groupName.includes("Legacy")
          ) {
            group.models.forEach((modelName) => {
              if (MODEL_ENCODINGS.r50k_base.includes(modelName as any)) {
                options.push({
                  value: modelName,
                  label: MODEL_DISPLAY_NAMES[modelName] || modelName,
                  group: group.groupName,
                });
              }
            });
          }
        });
      } else {
        // For other encodings, add models normally
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];

          // Check for audio/media special group
          if (specialGroups.audioMedia.models.includes(modelName)) {
            groupName = specialGroups.audioMedia.groupName;
          }

          options.push({
            value: modelName,
            label: MODEL_DISPLAY_NAMES[modelName] || modelName,
            group: groupName,
          });
        });
      }
    });

    return options;
  }, []);

  // Get encoding for the current model
  const encoding = isEncodingType(model) ? model : getEncodingForModel(model);
  const { tokens, tokenTexts, isLoading, error, tokenize, isChatMode } =
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
    <div className="max-w-7xl mx-auto p-10 min-h-screen grid grid-cols-[320px_1fr] gap-8 items-start max-[1024px]:gap-6 max-[900px]:grid-cols-1 max-[900px]:p-4 max-[768px]:p-3 max-[480px]:p-2">
      {/* --- CONTROL DECK (Sidebar) --- */}
      <Sidebar
        model={model}
        onModelChange={setModel}
        modelOptions={modelOptions}
        encoding={encoding}
        mode="chat"
        onExampleChat={handleExampleChat}
        onClearChat={handleClearChat}
        chatMessages={chatMessages}
        isLoading={isLoading}
      />

      {/* --- RIGHT PANEL: WORKSPACE --- */}
      <div className="flex flex-col gap-6 max-[768px]:pb-32 max-[600px]:pb-20 max-[480px]:pb-24">
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

        {/* Token Display */}
        {isLoading && (
          <div className="bg-gray-50 p-3 border border-gray-200">
            <div className="h-1 bg-gray-200 w-full mt-2 relative overflow-hidden">
              <div className="h-full bg-linear-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out animate-pulse" />
            </div>
            <p className="font-mono text-xxs text-gray-400 mt-1 text-right">
              Processing... Tokenizing chat messages
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4">
            <p className="font-mono text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <TokenDisplay
            text="" // Empty text for chat mode
            tokens={tokens || []}
            tokenTexts={tokenTexts || []}
            isChatMode={true}
            chatMessages={chatMessages}
          />
        )}
      </div>
    </div>
  );
}
