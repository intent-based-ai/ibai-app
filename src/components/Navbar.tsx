
import React, { useState } from 'react';
import { Link } from 'react-router';
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
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold relative">
            <div className="absolute -inset-2 rounded-full opacity-75 blur-sm"></div>
            <img src="/intent-based-ai-logo-transp.svg" alt="Logo" className="h-16 w-16 relative animate-float" />
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary py-1">
              Home
            </Link>
            {user && projects.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto flex items-center gap-1 hover:text-white px-2">
                    <span className="text-sm font-medium py-1">Projects</span>
                    <ChevronRight className="h-4 w-4 text-brand-orange transition-transform group-data-[state=open]:rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="mb-2 pl-8"
                      />
                    </div>
                  </div>
                  
                  <DropdownMenuGroup>
                    {recentProjects.length > 0 ? (
                      recentProjects.map(project => (
                        <DropdownMenuItem key={project.id}>
                          <Link to={`/project/${project.id}`} className="w-full cursor-pointer hover:bg-gradient-primary/10">
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
                  
                  <DropdownMenuItem>
                    <Link to="/projects" className="w-full cursor-pointer font-medium bg-gradient-primary gradient-text text-center">
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
              <span className="text-sm text-muted-foreground rounded-full px-3 py-1 bg-muted/50">
                {user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-brand-orange/10 hover:text-brand-orange">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-brand-blue/10 hover:text-brand-blue">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
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
            <Button variant="outline" size="icon" className="border-brand-blue/20 hover:border-brand-blue/50 hover:bg-brand-blue/5">
              <Github className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
