import { memo, useCallback } from "react";
import type { ChatMessage } from "../../types/chat";

interface ChatMessageEditorProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  disabled?: boolean;
}

const messageRoles: Array<ChatMessage["role"]> = [
  "system",
  "user",
  "assistant",
  "tool",
];

// Memoized message item component to prevent re-renders of other messages
const MessageItem = memo(
  ({
    message,
    index,
    disabled,
    onUpdateMessage,
    onRemoveMessage,
    onMoveMessage,
    messagesLength,
  }: {
    message: ChatMessage;
    index: number;
    disabled: boolean;
    onUpdateMessage: (
      index: number,
      field: keyof ChatMessage,
      value: string,
    ) => void;
    onRemoveMessage: (index: number) => void;
    onMoveMessage: (index: number, direction: "up" | "down") => void;
    messagesLength: number;
  }) => (
    <div className="border border-gray-200 p-3 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <select
          value={message.role}
          onChange={(e) =>
            onUpdateMessage(
              index,
              "role",
              e.target.value as ChatMessage["role"],
            )
          }
          disabled={disabled}
          className="font-mono text-xs border border-gray-300 px-2 py-1 bg-white focus:outline-none focus:border-brand-black disabled:opacity-50"
        >
          {messageRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={() => onMoveMessage(index, "up")}
          disabled={disabled || index === 0}
          className="font-mono text-xs bg-transparent border border-gray-300 px-1 py-0.5 rounded hover:border-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveMessage(index, "down")}
          disabled={disabled || index === messagesLength - 1}
          className="font-mono text-xs bg-transparent border border-gray-300 px-1 py-0.5 rounded hover:border-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={() => onRemoveMessage(index)}
          disabled={disabled}
          className="font-mono text-xs bg-red-500 text-white border border-red-600 px-1 py-0.5 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove"
        >
          ×
        </button>
      </div>

      <textarea
        value={message.content}
        onChange={(e) => onUpdateMessage(index, "content", e.target.value)}
        disabled={disabled}
        placeholder={`Enter ${message.role} message...`}
        className="w-full font-mono text-xs border border-gray-300 px-2 py-1 bg-white focus:outline-none focus:border-brand-black resize-y min-h-[60px] disabled:opacity-50"
      />
    </div>
  ),
);

MessageItem.displayName = "MessageItem";

export function ChatMessageEditor({
  messages,
  onMessagesChange,
  disabled = false,
}: ChatMessageEditorProps) {
  const addMessage = useCallback(() => {
    const newMessage: ChatMessage = {
      role: "user",
      content: "",
    };
    onMessagesChange([...messages, newMessage]);
  }, [messages, onMessagesChange]);

  const updateMessage = useCallback(
    (index: number, field: keyof ChatMessage, value: string) => {
      const updatedMessages = [...messages];
      updatedMessages[index] = {
        ...updatedMessages[index],
        [field]: value,
      };
      onMessagesChange(updatedMessages);
    },
    [messages, onMessagesChange],
  );

  const removeMessage = useCallback(
    (index: number) => {
      const updatedMessages = messages.filter((_, i) => i !== index);
      onMessagesChange(updatedMessages);
    },
    [messages, onMessagesChange],
  );

  const moveMessage = useCallback(
    (index: number, direction: "up" | "down") => {
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === messages.length - 1)
      ) {
        return;
      }

      const updatedMessages = [...messages];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      // Swap messages
      [updatedMessages[index], updatedMessages[newIndex]] = [
        updatedMessages[newIndex],
        updatedMessages[index],
      ];

      onMessagesChange(updatedMessages);
    },
    [messages, onMessagesChange],
  );

  const loadExampleChat = useCallback(() => {
    const exampleMessages: ChatMessage[] = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: "Hello, can you explain what tokenization is?",
      },
      {
        role: "assistant",
        content:
          "Tokenization is the process of breaking down text into smaller pieces called tokens. These tokens can be words, parts of words, or even individual characters. Language models like GPT use tokenization to process and understand text.",
      },
    ];
    onMessagesChange(exampleMessages);
  }, [onMessagesChange]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-semibold uppercase text-gray-600">
          Chat Messages
        </h3>
        <div className="flex gap-2">
          <button
            onClick={loadExampleChat}
            disabled={disabled}
            className="font-mono text-xs bg-transparent border border-gray-300 px-2 py-1 hover:border-brand-black hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Load Example
          </button>
          <button
            onClick={addMessage}
            disabled={disabled}
            className="font-mono text-xs bg-brand-orange text-brand-black border border-brand-black px-2 py-1 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Message
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-mono text-xs">
            No messages yet. Click "Add Message" or "Load Example" to start.
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageItem
              key={index}
              message={message}
              index={index}
              disabled={disabled}
              onUpdateMessage={updateMessage}
              onRemoveMessage={removeMessage}
              onMoveMessage={moveMessage}
              messagesLength={messages.length}
            />
          ))
        )}
      </div>
    </div>
  );
}
