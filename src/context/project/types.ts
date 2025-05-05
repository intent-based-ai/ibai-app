
import { Project, File } from '@/types/project';

export interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  saveProject: (project: Project) => Promise<void>;
  createProject: (title: string, description: string, files?: File[], context?: string, instructions?: string) => Promise<Project>;
  createProjectFromIntention: (intention: string, files?: File[]) => Promise<Project>;
  addFile: (projectId: string, file: Omit<File, 'id'>) => Promise<void>;
  updateFile: (projectId: string, fileId: string, content: string) => Promise<void>;
  deleteFile: (projectId: string, fileId: string) => Promise<void>;
  updateProjectContext: (projectId: string, context: string) => Promise<void>;
  updateProjectInstructions: (projectId: string, instructions: string) => Promise<void>;
  loading: boolean;
}
