
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Github, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-teal bg-clip-text text-xl font-bold">
              IB-AI
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            {user && (
              <Link to="/projects" className="text-sm font-medium transition-colors hover:text-primary">
                My Projects
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button>
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex"
          >
            <Button variant="outline" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
