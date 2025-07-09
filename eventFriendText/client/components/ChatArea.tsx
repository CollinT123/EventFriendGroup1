import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatAreaProps {
  selectedContactId?: string;
  selectedContactName?: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
}

export function ChatArea({
  selectedContactId,
  selectedContactName,
  messages,
  onSendMessage,
  onBack,
}: ChatAreaProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim() && selectedContactId) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedContactId) {
    return (
      <div className="h-full border-2 border-black rounded-2xl bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-base sm:text-lg text-center px-4">
          Select a contact to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="h-full border-2 border-black rounded-2xl bg-white flex flex-col">
      {/* Chat Header */}
      <div className="border-b-2 border-black p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden border-2 border-black rounded-full h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="font-semibold text-base sm:text-lg text-black">
            {selectedContactName}
          </h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg border-2 border-black ${
                  message.isOwn ? "bg-blue-100 ml-auto" : "bg-gray-100"
                }`}
              >
                <p className="text-sm sm:text-base text-black">
                  {message.text}
                </p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-black p-3 sm:p-4">
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type to enter text"
            className="flex-1 border-2 border-black rounded-lg text-sm sm:text-base"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-green-500 hover:bg-green-600 border-2 border-black rounded-full h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
