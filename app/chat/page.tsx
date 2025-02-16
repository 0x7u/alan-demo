"use client";

import * as React from "react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Form, ScrollArea } from "radix-ui";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/database.types";
import { User } from "@supabase/auth-js";
import MessageItem from "@/components/chat/MessageItem";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
type NewMessage = Database["public"]["Tables"]["messages"]["Insert"];

export default function Chat() {
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const fetchMessages = () =>
    supabase
      .from("messages")
      .select()
      .order("created_at", { ascending: true })
      .returns<Message[]>();

  const addMessages = (messages: Message[]) => {
    setMessages((prev) => [...prev, ...messages]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then((userResponse) => setUser(userResponse.data.user ?? undefined));
  }, []);

  useEffect(() => {
    fetchMessages().then(({ data }) => addMessages(data ?? []));
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("new-message")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (data) => {
          addMessages([data.new as Message]);
        },
      )
      .subscribe();

    return () => void channel.unsubscribe();
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessage: NewMessage = {
      sender_name: user?.email,
      text: input,
    };

    await supabase.from("messages").insert(newMessage);

    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="border border-black/10 dark:border-white/20 shadow-lg rounded p-4 flex flex-col justify-end gap-4 min-w-[90vw] md:min-w-[42rem]">
      <ScrollArea.Root>
        <ScrollArea.Viewport className="h-[50vh]">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                userId={user?.id}
                message={message}
              />
            ))}
            <div className="invisible" ref={messagesEndRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <Form.Root onSubmit={handleSubmit} className="flex items-center gap-2">
        <Form.Field name="message" className="flex-grow">
          <Form.Control asChild>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full border rounded p-2 border-black/10 dark:border-white/20 "
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button
            disabled={isLoading}
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
