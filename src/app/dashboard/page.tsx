import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const runtime = 'edge';

export default async function DashboardPage() {
  const user = await currentUser();

  // Protect the route
  if (!user) {
    redirect('/');
  }

  return <DashboardClient userFirstName={user.firstName || 'User'} />;
}
