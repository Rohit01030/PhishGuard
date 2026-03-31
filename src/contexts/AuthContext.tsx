import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, code: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUserProfile = async (authUser: User) => {
    try {
      const email = authUser.email || '';

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-user-signup`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: authUser.id,
          email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url,
          is_new_user: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile creation error:', errorData);
      }
    } catch (error) {
      console.error('Profile handling error:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await handleUserProfile(session.user);
          } catch (error) {
            console.error('Error handling user profile:', error);
          }
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOTP = async (email: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (email: string, code: string) => {
    try {
      const { data, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: 'Invalid OTP code' };
      }

      if (new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'OTP code has expired' };
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-32),
        options: {
          data: {
            email_verified: true,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
            email,
            password: Math.random().toString(36).slice(-32),
          });

          if (sessionError && sessionError.message.includes('Invalid login credentials')) {
            return { success: false, error: 'Account exists but password-based login not supported. Try OTP again.' };
          }
        }
        return { success: false, error: signUpError.message };
      }

      await supabase.from('otp_codes').delete().eq('email', email);

      return { success: true, user: signUpData.user ?? undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to verify OTP' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOTP, verifyOTP, signOut }}>
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
