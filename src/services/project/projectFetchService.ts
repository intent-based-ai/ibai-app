
import { supabase } from '@/integrations/supabase/client';
import { Project, File } from '@/types/project';
import { decodeFileContent } from './projectUtils';

export const projectFetchService = {
  async fetchProjects() {
    // First fetch the projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('ib_projects')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (projectsError) {
      console.error('Supabase error fetching projects:', projectsError);
      throw projectsError;
    }

    // For each project, fetch its files
    const projectsWithFiles = await Promise.all((projectsData || []).map(async (project) => {
      // Get files for this project
      const { data: filesData, error: filesError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', project.id);
      
      if (filesError) {
        console.error(`Error fetching files for project ${project.id}:`, filesError);
        // Continue with empty files rather than failing the whole fetch
      }

      // Convert binary content to string for each file
      const files = (filesData || []).map(file => ({
        id: file.id,
        name: file.path.split('/').pop() || 'unnamed', // Extract filename from path
        path: file.path,
        type: file.type,
        content: decodeFileContent(file.content),
        isDirectory: file.type === 'directory'
      }));

      // If code_files exists in the project, include that data too (for backwards compatibility)
      let codeFiles: File[] = [];
      if (project.code_files && Array.isArray(project.code_files)) {
        codeFiles = project.code_files.map(file => ({
          id: file.id || crypto.randomUUID(),
          name: file.name,
          path: file.path,
          type: file.type,
          content: file.content || '',
          isDirectory: file.type === 'directory'
        }));
      }

      // Combine files from both sources, with project_files taking precedence
      const allFiles = [...codeFiles, ...files];

      // Return project with its files
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        files: allFiles,
        name: project.title,
        knowledge_context: project.knowledge_context || '',
        knowledge_instructions: project.knowledge_instructions || '',
        customContext: project.knowledge_context || '',
        customInstructions: project.knowledge_instructions || '',
        created_at: project.created_at,
        updated_at: project.updated_at
      };
    }));

    console.log('Fetched projects with files:', projectsWithFiles);
    return projectsWithFiles;
  }
};
