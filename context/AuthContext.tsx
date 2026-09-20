import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { readJSON, STORAGE_KEYS, writeJSON } from "@/lib/localStore";

export type UserRole = "visitor" | "volunteer" | "admin";

export interface Session {
  name: string;
  email?: string;
  role: UserRole;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  isSupabaseConfigured: boolean;
  signInGuest: (name: string, role: UserRole) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  setRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setSession({
            name: data.session.user.user_metadata?.name ?? data.session.user.email ?? "Member",
            email: data.session.user.email ?? undefined,
            role: (data.session.user.user_metadata?.role as UserRole) ?? "visitor",
          });
        }
      } else {
        const stored = await readJSON<Session | null>(STORAGE_KEYS.session, null);
        if (stored) setSession(stored);
      }
      setLoading(false);
    })();
  }, []);

  const persist = async (s: Session | null) => {
    setSession(s);
    await writeJSON(STORAGE_KEYS.session, s);
  };

  const signInGuest = async (name: string, role: UserRole) => {
    await persist({ name: name.trim() || "Guest Volunteer", role });
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      await persist({
        name: data.user?.user_metadata?.name ?? email,
        email,
        role: (data.user?.user_metadata?.role as UserRole) ?? "visitor",
      });
      return {};
    }
    await persist({ name: email.split("@")[0], email, role: "visitor" });
    return {};
  };

  const signUpWithPassword = async (name: string, email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: "visitor" } },
      });
      if (error) return { error: error.message };
      await persist({ name: name || email, email, role: "visitor" });
      return {};
    }
    await persist({ name: name || email.split("@")[0], email, role: "visitor" });
    return {};
  };

  const setRole = async (role: UserRole) => {
    if (!session) return;
    await persist({ ...session, role });
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    await persist(null);
  };

  const value = useMemo(
    () => ({
      session,
      loading,
      isSupabaseConfigured,
      signInGuest,
      signInWithPassword,
      signUpWithPassword,
      setRole,
      signOut,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
