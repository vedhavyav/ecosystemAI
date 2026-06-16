'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/authContext';
import { getUserProfile, saveUserProfile, UserProfile } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { Leaf, TreePine, Sun, Droplets, Globe, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PREDEFINED_AVATARS = [
  { id: 'Leaf', icon: Leaf },
  { id: 'TreePine', icon: TreePine },
  { id: 'Sun', icon: Sun },
  { id: 'Droplets', icon: Droplets },
  { id: 'Globe', icon: Globe },
];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    role: 'individual',
    avatar: 'Leaf',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      getUserProfile(user.uid).then((data) => {
        if (data) {
          setProfile(data);
        }
        setIsLoadingProfile(false);
      });
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await saveUserProfile({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Eco User',
      role: profile.role as 'individual' | 'b2b',
      avatar: profile.avatar || 'Leaf',
    });
    setIsSaving(false);

    // Dispatch event for local state updates if necessary
    localStorage.setItem('userRole', profile.role || 'individual');
    window.dispatchEvent(new Event('role_updated'));

    alert('Profile saved successfully!');
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
        <p className="text-white">Loading Profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#022c22] flex flex-col items-center pt-32 p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-8"
      >
        <div className="flex items-center gap-4 mb-8">
          <UserCircle className="w-12 h-12 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Your Eco Profile</h1>
        </div>

        <div className="space-y-8">
          {/* Avatar Selection */}
          <div>
            <h2 className="text-xl font-medium text-white mb-4">Choose an Avatar</h2>
            <div className="flex flex-wrap gap-4">
              {PREDEFINED_AVATARS.map((av) => {
                const Icon = av.icon;
                const isSelected = profile.avatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setProfile({ ...profile, avatar: av.id })}
                    className={`p-4 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110'
                        : 'bg-white/5 text-emerald-100 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={32} strokeWidth={isSelected ? 2.5 : 1.5} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <h2 className="text-xl font-medium text-white mb-4">Account Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setProfile({ ...profile, role: 'individual' })}
                className={`p-6 rounded-2xl text-left transition-all ${
                  profile.role === 'individual'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-white'
                    : 'bg-white/5 border-2 border-transparent text-emerald-100 hover:bg-white/10'
                }`}
              >
                <h3 className="font-bold text-lg mb-1">Individual</h3>
                <p className="text-sm opacity-80">
                  Track your personal carbon footprint and lifestyle impacts.
                </p>
              </button>

              <button
                onClick={() => setProfile({ ...profile, role: 'b2b' })}
                className={`p-6 rounded-2xl text-left transition-all ${
                  profile.role === 'b2b'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-white'
                    : 'bg-white/5 border-2 border-transparent text-emerald-100 hover:bg-white/10'
                }`}
              >
                <h3 className="font-bold text-lg mb-1">Corporate (B2B)</h3>
                <p className="text-sm opacity-80">
                  Access ESG compliance tools and organization-wide metrics.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-500/20">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg transition-colors shadow-lg disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
