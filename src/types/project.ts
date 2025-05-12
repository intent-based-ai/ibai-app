
export type File = {
  id: string;
  name: string;
  path: string;
  isDirectory?: boolean;
  content?: string;
  type: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  files: File[];
  knowledge_context?: string;
  knowledge_instructions?: string;
  customContext?: string;  // Alias for knowledge_context
  customInstructions?: string;  // Alias for knowledge_instructions
  name?: string;  // Alias for title
  created_at: string;
  updated_at: string;
};

export type ProjectContextType = {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  saveProject: (project: Project) => Promise<void>;
  createProject: (title: string, description: string, files: File[]) => Promise<Project>;
  createProjectFromIntention: (intention: string, files?: File[]) => Promise<Project>;
  addFile: (projectId: string, file: Omit<File, 'id'>) => Promise<void>;
  updateFile: (projectId: string, fileId: string, content: string) => Promise<void>;
  deleteFile: (projectId: string, fileId: string) => Promise<void>;
  updateProjectContext: (projectId: string, context: string) => Promise<void>;
  updateProjectInstructions: (projectId: string, instructions: string) => Promise<void>;
  loading: boolean;
};
