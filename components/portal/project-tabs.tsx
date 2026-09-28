"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ProjectTabs({
  updates,
  files,
  messages,
}: {
  updates: React.ReactNode;
  files: React.ReactNode;
  messages: React.ReactNode;
}) {
  return (
    <Tabs defaultValue="updates" className="w-full">
      <TabsList className="mb-5">
        <TabsTrigger value="updates">Updates</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      <TabsContent value="updates">{updates}</TabsContent>
      <TabsContent value="files">{files}</TabsContent>
      <TabsContent value="messages">{messages}</TabsContent>
    </Tabs>
  );
}
