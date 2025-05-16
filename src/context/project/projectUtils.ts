import { Project } from '@/types/project';
import { projectService } from '@/services/project';

export const isProjectMock = (project: Project, userEmail?: string): boolean => {
  // Logic to identify if a project is a mock project
  return project.id.includes('mock') || 
         (userEmail?.includes('demo') && project.id.startsWith('demo-'));
};

export const createUpdatedProject = (project: Project, updates: Partial<Project>): Project => {
  return {
    ...project,
    ...updates,
    updated_at: new Date().toISOString()
  };
};

export const updateProjectFiles = async (
  projectId: string, 
  updatedFiles: Project['files'], 
  isMockProject: boolean
): Promise<void> => {
  if (isMockProject) {
    // For mock projects, we don't need to update the database
    console.log('Mock project, skipping database update');
    return;
  }
  
  // For real projects, update files in database
  await projectService.updateFile(projectId, updatedFiles);
};
