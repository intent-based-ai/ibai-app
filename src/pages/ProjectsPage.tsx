import React from 'react';
import { useProjects } from '@/context/project';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProjectsPage = () => {
  const { projects, loading } = useProjects();
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-muted-foreground">
          All your created projects in one place
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-4">You don't have any projects yet</p>
          <p className="text-muted-foreground mb-6">
            Go to the home page and describe what you want to build
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
