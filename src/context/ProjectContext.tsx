
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Project, ProjectContextType, File } from '@/types/project';
import { projectService } from '@/services/projectService';
import { useMockProjects } from '@/hooks/useMockProjects';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { generateMockProjects } = useMockProjects();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check for mock projects first
        const mockProjects = generateMockProjects(user.email || '');
        if (mockProjects) {
          setProjects(mockProjects);
          setLoading(false);
          return;
        }

        // Fetch real projects from Supabase
        const transformedProjects = await projectService.fetchProjects();
        setProjects(transformedProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const saveProject = async (project: Project) => {
    if (!user) return;

    try {
      setLoading(true);
      await projectService.saveProject(project);
      
      setProjects(prev => 
        prev.map(p => p.id === project.id ? project : p)
      );
    } catch (error: any) {
      console.error('Error saving project:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProjectFromIntention = async (intention: string, files?: File[]) => {
    const title = "Project from Intention";
    const description = "Your project is being generated";
    return createProject(title, description, files, intention);
  };

  const createProject = async (title: string, description: string, files?: File[], context?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      const createdProject = await projectService.createProject(
        user.id, 
        title, 
        description, 
        files, 
        context,
      );
      
      setProjects(prev => [createdProject, ...prev]);
      
      return createdProject;
    } catch (error: any) {
      console.error('Error creating project:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addFile = async (projectId: string, file: Omit<File, 'id'>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const newFile = { ...file, id: crypto.randomUUID() };
      const updatedFiles = [...project.files, newFile];
      
      await projectService.updateFile(projectId, updatedFiles);
      
      const updatedProject = {
        ...project,
        files: updatedFiles,
        updated_at: new Date().toISOString()
      };
      
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (error: any) {
      console.error('Error adding file:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to add file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (projectId: string, fileId: string, content: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const updatedFiles = project.files.map(file => 
        file.id === fileId ? { ...file, content } : file
      );
      
      await projectService.updateFile(projectId, updatedFiles);
      
      const updatedProject = {
        ...project,
        files: updatedFiles,
        updated_at: new Date().toISOString()
      };
      
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (error: any) {
      console.error('Error updating file:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (projectId: string, fileId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      const updatedFiles = project.files.filter(file => file.id !== fileId);
      
      await projectService.updateFile(projectId, updatedFiles);
      
      const updatedProject = {
        ...project,
        files: updatedFiles,
        updated_at: new Date().toISOString()
      };
      
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (error: any) {
      console.error('Error deleting file:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectContext = async (projectId: string, context: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await projectService.updateProjectField(projectId, 'knowledge_context', context);
      
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              knowledge_context: context,
              customContext: context,
              updated_at: new Date().toISOString()
            };
          }
          return project;
        })
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? {
          ...prev,
          knowledge_context: context,
          customContext: context,
          updated_at: new Date().toISOString()
        } : null);
      }
    } catch (error: any) {
      console.error('Error updating project context:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update project context',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectInstructions = async (projectId: string, instructions: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await projectService.updateProjectField(projectId, 'knowledge_instructions', instructions);
      
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              knowledge_instructions: instructions,
              customInstructions: instructions,
              updated_at: new Date().toISOString()
            };
          }
          return project;
        })
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? {
          ...prev,
          knowledge_instructions: instructions,
          customInstructions: instructions,
          updated_at: new Date().toISOString()
        } : null);
      }
    } catch (error: any) {
      console.error('Error updating project instructions:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update project instructions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        saveProject,
        createProject,
        createProjectFromIntention,
        addFile,
        updateFile,
        deleteFile,
        updateProjectContext,
        updateProjectInstructions,
        loading
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
