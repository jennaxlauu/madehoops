import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, StaffUser } from '@/lib/supabase';

type AuthContextType = {
  user: StaffUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userId = await getStoredUserId();
      if (userId) {
        const { data, error } = await supabase
          .from('staff_users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  async function signIn(email: string, password: string) {
    try {
      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase
        .from('staff_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('password_hash', passwordHash)
        .maybeSingle();

      if (error || !data) {
        return { error: 'Invalid email or password' };
      }

      await storeUserId(data.id);
      setUser(data);
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An error occurred during sign in' };
    }
  }

  async function signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
  }) {
    try {
      const passwordHash = await hashPassword(data.password);

      const { data: existingUser } = await supabase
        .from('staff_users')
        .select('id')
        .eq('email', data.email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        return { error: 'An account with this email already exists' };
      }

      const { data: newUser, error } = await supabase
        .from('staff_users')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email.toLowerCase(),
          role: data.role,
          password_hash: passwordHash,
        })
        .select()
        .single();

      if (error) {
        return { error: 'Failed to create account' };
      }

      await storeUserId(newUser.id);
      setUser(newUser);
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An error occurred during sign up' };
    }
  }

  async function signOut() {
    await clearStoredUserId();
    setUser(null);
  }

  async function refreshUser() {
    try {
      const userId = await getStoredUserId();
      if (userId) {
        const { data, error } = await supabase
          .from('staff_users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

let storedUserId: string | null = null;

async function storeUserId(userId: string) {
  storedUserId = userId;
}

async function getStoredUserId(): Promise<string | null> {
  return storedUserId;
}

async function clearStoredUserId() {
  storedUserId = null;
}
