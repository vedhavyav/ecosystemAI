'use client';
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { useAuth } from '@/lib/firebase/authContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#022c22] flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  }

  return <DashboardClient userFirstName={user.displayName || 'User'} />;
}
