'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/app-layout';
import Co2Card from '@/components/dashboard/co2-card';
import GamificationCard from '@/components/dashboard/gamification-card';
import LogActionForm from '@/components/dashboard/log-action-form';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import { useAuth } from '@/components/auth-provider';
import type { EcoUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { ecoUser, loading } = useAuth();
  const [user, setUser] = useState<EcoUser | null>(null);

  useEffect(() => {
    if (!loading && ecoUser) {
      setUser(ecoUser);
    }
  }, [ecoUser, loading]);

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome back, {user?.displayName?.split(' ')[0] || 'friend'}!
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Co2Card totalCO2e={user?.totalCO2e || 0} />
            <GamificationCard points={user?.points || 0} badges={user?.badges || []} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
            <LogActionForm userId={user?.uid || ''} />
            <RecommendationsCard userId={user?.uid || ''} />
        </div>
      </div>
    </AppLayout>
  );
}
