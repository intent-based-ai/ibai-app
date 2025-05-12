
import { Project, File } from '@/types/project';
import { projectService } from '@/services/projectService';
import { useMockProjects } from '@/hooks/useMockProjects';

export const isProjectMock = (project: Project, userEmail: string | null): boolean => {
  if (!userEmail) return false;
  
  const { generateMockProjects } = useMockProjects();
  const mockProjects = generateMockProjects(userEmail);
  
  return project.id.includes('mock') || 
         (mockProjects?.some(p => p.id === project.id) || false);
};

export const createUpdatedProject = (
  project: Project, 
  updates: Partial<Project>
): Project => {
  return {
    ...project,
    ...updates,
    updated_at: new Date().toISOString()
  };
};

export const updateProjectFiles = async (
  projectId: string, 
  updatedFiles: File[], 
  isMock: boolean
): Promise<void> => {
  if (!isMock) {
    await projectService.updateFile(projectId, updatedFiles);
  }
};
