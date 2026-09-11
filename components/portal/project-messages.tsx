"use client";

import { MessageThread, type ThreadMessage } from "@/components/portal/message-thread";
import { sendProjectMessage } from "@/app/actions/portal";

export function ProjectMessages({ projectId, messages }: { projectId: string; messages: ThreadMessage[] }) {
  return (
    <MessageThread
      messages={messages}
      emptyLabel="Message your drafting team about this project."
      onSend={(body) => sendProjectMessage(projectId, body)}
    />
  );
}
