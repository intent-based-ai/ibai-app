
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type File = {
  id: string;
  name: string;
  path: string;
  content: string;
  type: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  files: File[];  // Changed from code_files to files
  knowledge_context?: string;
  knowledge_instructions?: string;
  customContext?: string;  // Added alias for knowledge_context
  customInstructions?: string;  // Added alias for knowledge_instructions
  name?: string;  // Added alias for title
  created_at: string;
  updated_at: string;
};

type ProjectContextType = {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  saveProject: (project: Project) => Promise<void>;
  createProject: (title: string, description: string, files: File[]) => Promise<Project>;
  addFile: (projectId: string, file: Omit<File, 'id'>) => Promise<void>;
  updateFile: (projectId: string, fileId: string, content: string) => Promise<void>;
  deleteFile: (projectId: string, fileId: string) => Promise<void>;
  updateProjectContext: (projectId: string, context: string) => Promise<void>;
  updateProjectInstructions: (projectId: string, instructions: string) => Promise<void>;
  loading: boolean;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load projects when user changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        // Transform data from Supabase to match our Project type
        const transformedProjects = (data || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          files: project.code_files || [],
          name: project.title, // Add alias
          knowledge_context: project.knowledge_context || '',
          knowledge_instructions: project.knowledge_instructions || '',
          customContext: project.knowledge_context || '', // Add alias
          customInstructions: project.knowledge_instructions || '', // Add alias
          created_at: project.created_at,
          updated_at: project.updated_at
        }));

        setProjects(transformedProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error.message);
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
      // Update the project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          description: project.description,
          code_files: project.code_files,
          knowledge_context: project.knowledge_context,
          knowledge_instructions: project.knowledge_instructions,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      // Update local state
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

  const createProject = async (title: string, description: string, files: File[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      const newProject = {
        title,
        description,
        code_files: files, // Note: in DB it's still code_files
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;

      // Add to local state with transformed properties
      const createdProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        name: data.title, // Add alias
        files: data.code_files || [], // Transform to files
        knowledge_context: data.knowledge_context || '',
        knowledge_instructions: data.knowledge_instructions || '',
        customContext: data.knowledge_context || '', // Add alias
        customInstructions: data.knowledge_instructions || '', // Add alias
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
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
      
      // Get current project
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      // Create new file with ID
      const newFile = { ...file, id: crypto.randomUUID() };
      
      // Add file to project
      const updatedFiles = [...project.files, newFile];
      
      // Update project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          code_files: updatedFiles, // Note: in DB it's still code_files
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      
      // Update local state
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
      
      // Get current project
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      // Update file content
      const updatedFiles = project.files.map(file => 
        file.id === fileId ? { ...file, content } : file
      );
      
      // Update project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          code_files: updatedFiles, // Note: in DB it's still code_files
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      
      // Update local state
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
      
      // Get current project
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');
      
      // Remove file
      const updatedFiles = project.files.filter(file => file.id !== fileId);
      
      // Update project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          code_files: updatedFiles, // Note: in DB it's still code_files
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      
      // Update local state
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
      
      // Update project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          knowledge_context: context,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      
      // Update local state
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              knowledge_context: context,
              customContext: context, // Update alias
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
          customContext: context, // Update alias
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
      
      // Update project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({
          knowledge_instructions: instructions,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
      
      // Update local state
      setProjects(prev => 
        prev.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              knowledge_instructions: instructions,
              customInstructions: instructions, // Update alias
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
          customInstructions: instructions, // Update alias
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
