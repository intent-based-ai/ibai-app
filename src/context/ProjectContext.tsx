
import React, { createContext, useContext, useState, useEffect } from 'react';

type File = {
  id: string;
  name: string;
  path: string;
  content: string;
  type: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  files: File[];
  createdAt: string;
  updatedAt: string;
  customContext?: string;
  customInstructions?: string;
};

type ProjectContextType = {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  saveProject: (project: Project) => void;
  createProject: (name: string, description: string, files: File[]) => Project;
  addFile: (projectId: string, file: Omit<File, 'id'>) => void;
  updateFile: (projectId: string, fileId: string, content: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
  updateProjectContext: (projectId: string, context: string) => void;
  updateProjectInstructions: (projectId: string, instructions: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('ib-ai-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('ib-ai-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const saveProject = (project: Project) => {
    setProjects(prev => {
      const existingIndex = prev.findIndex(p => p.id === project.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...project,
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        return [...prev, project];
      }
    });
  };

  const createProject = (name: string, description: string, files: File[]) => {
    const newProject = {
      id: crypto.randomUUID(),
      name,
      description,
      files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const addFile = (projectId: string, file: Omit<File, 'id'>) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            files: [...project.files, { ...file, id: crypto.randomUUID() }],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      })
    );
  };

  const updateFile = (projectId: string, fileId: string, content: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            files: project.files.map(file => 
              file.id === fileId ? { ...file, content } : file
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      })
    );
  };

  const deleteFile = (projectId: string, fileId: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            files: project.files.filter(file => file.id !== fileId),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      })
    );
  };

  const updateProjectContext = (projectId: string, context: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            customContext: context,
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      })
    );
  };

  const updateProjectInstructions = (projectId: string, instructions: string) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            customInstructions: instructions,
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      })
    );
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
        updateProjectInstructions
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
