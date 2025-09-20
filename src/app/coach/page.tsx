'use client';

import React from 'react';
import AppLayout from '@/components/app-layout';
import ChatView from '@/components/coach/chat-view';

export default function CoachPage() {
  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold font-headline">Eco-Coach</h1>
          <p className="text-muted-foreground">
            Your personal AI assistant for all things green.
          </p>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ChatView />
        </main>
      </div>
    </AppLayout>
  );
}
