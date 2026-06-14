import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const runtime = 'edge';

export default async function AdminPage() {
  const user = await currentUser();

  // Protect the route
  if (!user) {
    redirect('/sign-in');
  }

  // In a real app, we'd check if user.publicMetadata.role === 'admin'
  // For the hackathon, we'll let any logged-in user see the mock admin page
  return <AdminClient />;
}
