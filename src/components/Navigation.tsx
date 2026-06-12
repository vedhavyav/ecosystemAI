"use client";

import { useState, useEffect } from "react";

import { Home, LineChart, LogIn, User, LogOut } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useUser, useClerk } from "@clerk/nextjs";

export function Navigation() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();

  const [isB2B, setIsB2B] = useState(false);

  useEffect(() => {
    setIsB2B(localStorage.getItem('userRole') === 'b2b');
    const handleRole = () => setIsB2B(localStorage.getItem('userRole') === 'b2b');
    window.addEventListener('role_updated', handleRole);
    return () => window.removeEventListener('role_updated', handleRole);
  }, []);

  const navItems: any[] = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'System Tests', url: '/tests', icon: LineChart },
  ];

  if (!isLoaded) {
    // Keep it clean while checking auth
  } else if (isSignedIn) {
    if (isB2B) {
      navItems.unshift({ name: 'Corporate ESG', url: '/admin', icon: Home });
    }
    navItems.unshift({ name: 'My Dashboard', url: '/dashboard', icon: Home });
    navItems.push({ 
      name: 'Sign Out', 
      url: '#', 
      icon: LogOut,
      action: () => {
        if (window.confirm('Are you sure you want to sign out?')) {
          signOut();
        }
      }
    });
  } else {
    navItems.push({ 
      name: 'Sign In', 
      url: '#', 
      icon: LogIn,
      action: () => openSignIn()
    });
  }

  return <NavBar items={navItems} />;
}
