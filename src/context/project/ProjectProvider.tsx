
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Project, File } from '@/types/project';
import { projectService } from '@/services/projectService';
import { useMockProjects } from '@/hooks/useMockProjects';
import { useAuth } from '@/context/AuthContext';
import ProjectContext from './ProjectContext';
import { isProjectMock, createUpdatedProject, updateProjectFiles } from './projectUtils';

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
        
        // Get mock projects for specific users
        const mockProjects = generateMockProjects(user.email || '');
        
        // Fetch real projects from Supabase
        let realProjects: Project[] = [];
        try {
          realProjects = await projectService.fetchProjects();
        } catch (error) {
          console.error('Error fetching real projects:', error);
          // Continue with mock projects even if real projects fetch fails
        }
        
        // Combine mock and real projects
        // If we have mock projects for this user, add them to the beginning of the list
        const combinedProjects = mockProjects ? [...mockProjects, ...realProjects] : realProjects;
        
        setProjects(combinedProjects);
      } catch (error: any) {
        console.error('Error in project fetching flow:', error.message);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
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
      
      // Check if it's a mock project (for demo users)
      const isMockProject = isProjectMock(project, user.email);
      
      if (!isMockProject) {
        // Only save real projects to the database
        await projectService.saveProject(project);
      }
      
      // Update local state regardless of project type
      setProjects(prev => 
        prev.map(p => p.id === project.id ? project : p)
      );
      
      toast({
        title: 'Success',
        description: 'Project saved successfully',
      });
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

  const createProject = async (title: string, description: string, files?: File[], context?: string, instructions?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      
      // Demo users with mock projects can still create new projects in the database
      const createdProject = await projectService.createProject(
        user.id, 
        title, 
        description, 
        files, 
        context, 
        instructions
      );
      
      setProjects(prev => [createdProject, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      
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
      
      // Check if it's a mock project
      const isMockProject = isProjectMock(project, user.email);
      
      await updateProjectFiles(projectId, updatedFiles, isMockProject);
      
      const updatedProject = createUpdatedProject(project, { files: updatedFiles });
      
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
      
      // Check if it's a mock project
      const isMockProject = isProjectMock(project, user.email);
      
      await updateProjectFiles(projectId, updatedFiles, isMockProject);
      
      const updatedProject = createUpdatedProject(project, { files: updatedFiles });
      
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
      
      // Check if it's a mock project
      const isMockProject = isProjectMock(project, user.email);
      
      await updateProjectFiles(projectId, updatedFiles, isMockProject);
      
      const updatedProject = createUpdatedProject(project, { files: updatedFiles });
      
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

  const updateProjectField = async (
    projectId: string, 
    fieldName: 'knowledge_context' | 'knowledge_instructions', 
    value: string, 
    clientFieldName: 'customContext' | 'customInstructions'
  ) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      // Check if it's a mock project
      const isMockProject = isProjectMock(project, user.email);
      
      if (!isMockProject) {
        // Only update real projects in the database
        await projectService.updateProjectField(projectId, fieldName, value);
      }
      
      const updates: Partial<Project> = {
        [fieldName]: value,
        [clientFieldName]: value
      };
      
      const updatedProject = createUpdatedProject(project, updates);
      
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
    } catch (error: any) {
      console.error(`Error updating project ${fieldName}:`, error.message);
      toast({
        title: 'Error',
        description: `Failed to update project ${fieldName}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectContext = async (projectId: string, context: string) => {
    return updateProjectField(projectId, 'knowledge_context', context, 'customContext');
  };

  const updateProjectInstructions = async (projectId: string, instructions: string) => {
    return updateProjectField(projectId, 'knowledge_instructions', instructions, 'customInstructions');
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
