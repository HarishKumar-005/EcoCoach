'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  LayoutDashboard,
  Leaf,
  LogOut,
} from 'lucide-react';
import { useAuth } from './auth-provider';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from './ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0].substring(0, 2);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
             <Button variant="ghost" className="h-10 w-10 p-2 rounded-full">
                <Leaf className="h-6 w-6 text-primary" />
             </Button>
            <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">Eco-Coach</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton isActive={pathname === '/dashboard'} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/coach">
                <SidebarMenuButton isActive={pathname === '/coach'} tooltip="Eco-Coach">
                  <Bot />
                  <span>Eco-Coach</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold truncate">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 group-data-[collapsible=icon]:hidden" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="md:hidden p-2 flex items-center justify-between border-b">
          <SidebarTrigger />
          <span className="font-bold font-headline">Eco-Coach</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
