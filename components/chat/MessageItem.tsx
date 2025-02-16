import { twMerge } from "tailwind-merge";
import * as React from "react";
import { Message } from "@/app/chat/page";

type MessageItemProps = {
  userId?: string;
  message: Message;
};

export default function MessageItem({ userId, message }: MessageItemProps) {
  let isSender = message.sender_id === (userId ?? null);

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2",
        isSender ? "self-end items-end" : "self-start items-start",
      )}
    >
      <div
        className={twMerge(
          "p-2 rounded shadow-lg",
          isSender
            ? "bg-green-300 dark:bg-green-600"
            : "bg-blue-300 dark:bg-blue-600",
        )}
      >
        {message.text}
      </div>
      <div
        className={twMerge(
          "text-xs text-gray-200",
          isSender ? "self-end" : "self-start",
        )}
      >
        {message.sender_name}
      </div>
    </div>
  );
}
