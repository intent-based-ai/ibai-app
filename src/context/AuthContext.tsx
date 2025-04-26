
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

type AuthUser = {
  id: string;
  name: string | null;
  email: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  session: Session | null;
  login: (email: string, password: string) => Promise<any>; // Changed return type from Promise<void> to Promise<any>
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      
      // Simple synchronous updates first
      setSession(newSession);
      
      if (newSession?.user) {
        const { id, email } = newSession.user;
        
        // Get user profile data separately to avoid deadlock
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', id)
              .single();
              
            setUser({
              id,
              email: email || '',
              name: profile?.name
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Still set basic user info even if profile fetch fails
            setUser({
              id,
              email: email || '',
              name: null
            });
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log('Initial session check:', currentSession?.user?.email);
        
        if (currentSession?.user) {
          const { id, email } = currentSession.user;
          
          // Get user profile and set the session
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', id)
              .single();
              
            setUser({
              id,
              email: email || '',
              name: profile?.name
            });
          } catch (profileError) {
            console.error('Error fetching initial profile:', profileError);
            // Set basic user info even if profile fetch fails
            setUser({
              id,
              email: email || '',
              name: null
            });
          }
          
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        // Ensure loading state is updated regardless of success or failure
        setIsLoading(false);
      }
    };

    // Initialize auth state
    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Login attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      // Make sure we have a successful login with a session
      if (!data.session) {
        console.error('No session returned after login');
        throw new Error("Failed to get session after login");
      }
      
      console.log('Login successful for:', data.user?.email);
      
      // Update the session immediately
      setSession(data.session);
      
      if (data.user) {
        const { id, email } = data.user;
        
        // Set basic user info immediately
        setUser({
          id,
          email: email || '',
          name: null // Will be populated later
        });
        
        // Get user profile in a separate call
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', id)
          .single();
          
        // Update with full user info including profile
        setUser({
          id,
          email: email || '',
          name: profile?.name
        });
      }
      
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully",
      });
      
      return data; // This is what causes the type error, but we've fixed the type definition
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('Logging out user:', user?.email);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
      
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
