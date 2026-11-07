import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../lib/types';

interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
  app_metadata: {
    role?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setDemoUser: (role: 'admin' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo user by default so user can test customer and admin features
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const mappedUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: { full_name: session.user.user_metadata?.full_name },
              app_metadata: { role: session.user.app_metadata?.role },
            };
            setUser(mappedUser);

            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (prof) setProfile(prof);
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const u: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                user_metadata: { full_name: session.user.user_metadata?.full_name },
                app_metadata: { role: session.user.app_metadata?.role },
              };
              setUser(u);
            } else {
              setUser(null);
              setProfile(null);
            }
          });
        } else {
          // Check localStorage for saved session
          const savedAuth = localStorage.getItem('vella_demo_user');
          if (savedAuth) {
            const parsed = JSON.parse(savedAuth);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.warn('Auth initialization warning:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const isAdmin = Boolean(
    user?.app_metadata?.role === 'admin' || profile?.role === 'admin'
  );

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error };
        return { error: null };
      }

      // Offline / Local auth
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        user_metadata: { full_name: email.split('@')[0] },
        app_metadata: { role },
      };
      const newProfile: Profile = {
        id: newUser.id,
        email,
        full_name: email.split('@')[0],
        role,
      };
      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem('vella_demo_user', JSON.stringify({ user: newUser, profile: newProfile }));
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) return { error };
        return { error: null };
      }

      const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        user_metadata: { full_name: fullName },
        app_metadata: { role },
      };
      const newProfile: Profile = {
        id: newUser.id,
        email,
        full_name: fullName,
        role,
      };
      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem('vella_demo_user', JSON.stringify({ user: newUser, profile: newProfile }));
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('vella_demo_user');
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    }
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      if (user) {
        localStorage.setItem(
          'vella_demo_user',
          JSON.stringify({ user, profile: updated })
        );
      }
    }
    if (isSupabaseConfigured && user) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  const setDemoUser = (role: 'admin' | 'customer') => {
    const isAdm = role === 'admin';
    const demoUser: AuthUser = {
      id: isAdm ? 'usr-admin-vella' : 'usr-customer-01',
      email: isAdm ? 'admin@vella-marketplace.com' : 'customer@example.com',
      user_metadata: { full_name: isAdm ? 'Alexander Wright (Store Director)' : 'Elena Rostova' },
      app_metadata: { role },
    };
    const demoProfile: Profile = {
      id: demoUser.id,
      email: demoUser.email,
      full_name: demoUser.user_metadata.full_name || '',
      phone: isAdm ? '+1 (800) 845-8355' : '+1 (415) 320-8910',
      role,
    };
    setUser(demoUser);
    setProfile(demoProfile);
    localStorage.setItem(
      'vella_demo_user',
      JSON.stringify({ user: demoUser, profile: demoProfile })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
