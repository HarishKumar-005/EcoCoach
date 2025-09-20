'use client';

import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
