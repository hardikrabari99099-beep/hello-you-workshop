import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) await loadMe();
      if (alive) setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setUser(null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) {
      const err = new Error(error.message);
      err.response = { data: { detail: "Invalid credentials" } };
      throw err;
    }
    const me = await loadMe();
    return me;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    await supabase.auth.signInWithPassword({ email: data.email, password: payload.password });
    const me = await loadMe();
    return { ...me, ...data };
  };

  const refresh = loadMe;

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
