
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Github, LogOut, ChevronRight, Search } from 'lucide-react';
import { useProjects } from '@/context/project';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get only the 5 most recent projects
  const recentProjects = filteredProjects.slice(0, 5);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/intent-based-ai-logo-transp.svg" alt="Logo" className="h-8 w-8" />
            <span className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-teal bg-clip-text text-xl font-bold">
              IB-AI
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            {user && projects.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto flex items-center gap-1">
                    <span className="text-sm font-medium transition-colors hover:text-primary">Projects</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
                  <div className="p-2">
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="mb-2"
                    />
                  </div>
                  
                  <DropdownMenuGroup>
                    {recentProjects.length > 0 ? (
                      recentProjects.map(project => (
                        <DropdownMenuItem key={project.id} asChild>
                          <Link to={`/project/${project.id}`} className="cursor-pointer">
                            {project.title}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        {searchQuery ? 'No matching projects' : 'No recent projects'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/projects" className="cursor-pointer font-medium">
                      Go to projects
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : user && (
              <Link to="/projects" className="text-sm font-medium transition-colors hover:text-primary">
                Projects
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
