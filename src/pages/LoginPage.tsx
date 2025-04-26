
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const from = (location.state as any)?.from || '/';
  
  // Check if user is already logged in and redirect
  useEffect(() => {
    if (user && session) {
      console.log('User is already logged in, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, session, from, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('Submitting login form...');
    
    try {
      await login(email, password);
      console.log('Login function completed successfully');
      
      // After successful login, we'll redirect in the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already handled in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading && !isSubmitting) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // If already logged in, we'll redirect via the useEffect
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Log in to IB-AI</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
