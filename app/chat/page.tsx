"use client";

import * as React from "react";
import { Form, ScrollArea } from "radix-ui";
import { twMerge } from "tailwind-merge";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "msg-1",
      text: "Hey there! How was your day?",
      sender: "Alice",
      timestamp: new Date("2023-10-01T14:23:00Z"),
    },
    {
      id: "msg-2",
      text: "It was good, thanks for asking! How about yours?",
      sender: "Bob",
      timestamp: new Date("2023-10-01T14:25:00Z"),
    },
    {
      id: "msg-3",
      text: "Pretty hectic, but I managed. Did you see the game last night?",
      sender: "Alice",
      timestamp: new Date("2023-10-01T14:28:00Z"),
    },
    {
      id: "msg-4",
      text: "No, I missed it. How was it?",
      sender: "Bob",
      timestamp: new Date("2023-10-01T14:30:00Z"),
    },
    {
      id: "msg-5",
      text: "It was incredible! You should watch the highlights.",
      sender: "Alice",
      timestamp: new Date("2023-10-01T14:32:00Z"),
    },
    {
      id: "msg-6",
      text: "Will do! Thanks for the heads up.",
      sender: "Bob",
      timestamp: new Date("2023-10-01T14:35:00Z"),
    },
  ]);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: crypto.randomUUID(),
        text: "Thanks for your message! This is a simulated response.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="border border-black/10 dark:border-white/20 shadow-lg flex-grow rounded p-4 flex flex-col justify-end gap-4">
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                className={twMerge(
                  "p-2 rounded shadow-lg",
                  m.sender === "Bob"
                    ? "bg-green-300 dark:bg-green-600 self-end"
                    : "bg-blue-300 dark:bg-blue-600 self-start",
                )}
                key={m.id}
              >
                {m.text}
              </div>
            ))}
            {true && (
              <div className="self-center italic text-gray-300 text-sm">
                AI is typing...
              </div>
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <Form.Root onSubmit={() => {}} className="flex items-center gap-2">
        <Form.Field name="message" className="flex-grow">
          <Form.Control asChild>
            <input
              placeholder="Type your message..."
              className="w-full border rounded p-2 border-black/10 dark:border-white/20 "
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button
            type="submit"
            className="dark:hover:bg-blue-600 hover:bg-blue-300 p-2 rounded-full"
          >
            <PaperPlaneIcon className="size-5" />
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}
