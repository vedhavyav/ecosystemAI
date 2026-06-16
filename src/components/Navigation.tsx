'use client';

import { useState, useEffect } from 'react';

import { Home, LineChart, LogIn, User, LogOut } from 'lucide-react';
import { NavBar, NavItem } from '@/components/ui/tubelight-navbar';
import { useAuth } from '@/lib/firebase/authContext';

export function Navigation() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const [isB2B, setIsB2B] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('userRole') === 'b2b' : false;
  });

  useEffect(() => {
    const handleRole = () => setIsB2B(localStorage.getItem('userRole') === 'b2b');
    window.addEventListener('role_updated', handleRole);
    return () => window.removeEventListener('role_updated', handleRole);
  }, []);

  const navItems: NavItem[] = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'System Tests', url: '/tests', icon: LineChart },
  ];

  if (loading) {
    // Keep it clean while checking auth
  } else if (user) {
    if (isB2B) {
      navItems.unshift({ name: 'Corporate ESG', url: '/admin', icon: Home });
    }
    navItems.unshift({ name: 'My Dashboard', url: '/dashboard', icon: Home });
    navItems.push({ name: 'Profile', url: '/profile', icon: User });
    navItems.push({
      name: 'Sign Out',
      url: '#',
      icon: LogOut,
      action: async () => {
        if (window.confirm('Are you sure you want to sign out?')) {
          await signOut();
        }
      },
    });
  } else {
    navItems.push({
      name: 'Sign In with Google',
      url: '#',
      icon: LogIn,
      action: async () => await signInWithGoogle(),
    });
  }

  return <NavBar items={navItems} />;
}
