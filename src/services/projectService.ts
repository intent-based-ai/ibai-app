
import { supabase } from '@/integrations/supabase/client';
import { Project, File } from '@/types/project';

export const projectService = {
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
        content: file.content ? new TextDecoder().decode(file.content) : '',
        isDirectory: file.type === 'directory'
      }));

      // Return project with its files
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        files: files,
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
  },

  async saveProject(project: Project) {
    console.log('Saving project to Supabase:', project.id);
    // Update only the project details, not the files
    const { error } = await supabase
      .from('ib_projects')
      .update({
        title: project.title,
        description: project.description,
        knowledge_context: project.knowledge_context || project.customContext,
        knowledge_instructions: project.knowledge_instructions || project.customInstructions,
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id);

    if (error) {
      console.error('Supabase error saving project:', error);
      throw error;
    }
  },

  async createProject(
    userId: string, 
    title: string, 
    description: string, 
    files?: File[], 
    context?: string, 
    instructions?: string
  ) {
    console.log('Creating new project in Supabase for user:', userId);
    // Create the project first
    const { data: projectData, error: projectError } = await supabase
      .from('ib_projects')
      .insert({
        title,
        description,
        user_id: userId,
        knowledge_context: context || '',
        knowledge_instructions: instructions || '',
      })
      .select()
      .single();

    if (projectError) {
      console.error('Supabase error creating project:', projectError);
      throw projectError;
    }

    // If files are provided, create them in the project_files table
    if (files && files.length > 0) {
      const fileInserts = files.map(file => ({
        project_id: projectData.id,
        manifest_id: '00000000-0000-0000-0000-000000000000', // Default manifest ID - you may need to adjust this
        path: file.path,
        type: file.type,
        content: file.content ? new TextEncoder().encode(file.content) : null,
        ai_type: 'generated'
      }));

      const { error: filesError } = await supabase
        .from('project_files')
        .insert(fileInserts);

      if (filesError) {
        console.error('Supabase error creating files:', filesError);
        // Continue despite file error, the project is still created
      }
    }

    // Fetch the files we just created to return a complete project
    const { data: filesData } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectData.id);

    const projectFiles = (filesData || []).map(file => ({
      id: file.id,
      name: file.path.split('/').pop() || 'unnamed',
      path: file.path,
      type: file.type,
      content: file.content ? new TextDecoder().decode(file.content) : '',
      isDirectory: file.type === 'directory'
    }));

    return {
      id: projectData.id,
      title: projectData.title,
      description: projectData.description,
      name: projectData.title,
      files: projectFiles,
      knowledge_context: projectData.knowledge_context || '',
      knowledge_instructions: projectData.knowledge_instructions || '',
      customContext: projectData.knowledge_context || '',
      customInstructions: projectData.knowledge_instructions || '',
      created_at: projectData.created_at,
      updated_at: projectData.updated_at
    };
  },

  async updateFile(projectId: string, updatedFiles: File[]) {
    console.log('Updating files for project:', projectId);
    
    // First, fetch existing files to compare
    const { data: existingFiles, error: fetchError } = await supabase
      .from('project_files')
      .select('id, path')
      .eq('project_id', projectId);
    
    if (fetchError) {
      console.error('Supabase error fetching existing files:', fetchError);
      throw fetchError;
    }
    
    const existingFilesMap = new Map(
      (existingFiles || []).map(file => [file.path, file.id])
    );
    
    const filesToUpdate = [];
    const filesToInsert = [];

    for (const file of updatedFiles) {
      const existingId = existingFilesMap.get(file.path);
      
      if (existingId) {
        // Update existing file
        filesToUpdate.push({
          id: existingId,
          content: file.content ? new TextEncoder().encode(file.content) : null,
          updated_at: new Date().toISOString()
        });
      } else {
        // Insert new file
        filesToInsert.push({
          project_id: projectId,
          manifest_id: '00000000-0000-0000-0000-000000000000', // Default manifest ID
          path: file.path,
          type: file.type,
          content: file.content ? new TextEncoder().encode(file.content) : null,
          ai_type: 'generated',
          updated_at: new Date().toISOString()
        });
      }
    }
    
    // Get paths from updated files to identify deletions
    const updatedFilePaths = new Set(updatedFiles.map(file => file.path));
    const filesToDelete = existingFiles
      ?.filter(file => !updatedFilePaths.has(file.path))
      .map(file => file.id) || [];
    
    // Perform database operations
    const promises = [];
    
    if (filesToUpdate.length > 0) {
      promises.push(
        supabase
          .from('project_files')
          .upsert(filesToUpdate)
          .then(({ error }) => {
            if (error) console.error('Supabase error updating files:', error);
            return { success: !error, error };
          })
      );
    }
    
    if (filesToInsert.length > 0) {
      promises.push(
        supabase
          .from('project_files')
          .insert(filesToInsert)
          .then(({ error }) => {
            if (error) console.error('Supabase error inserting files:', error);
            return { success: !error, error };
          })
      );
    }
    
    if (filesToDelete.length > 0) {
      promises.push(
        supabase
          .from('project_files')
          .delete()
          .in('id', filesToDelete)
          .then(({ error }) => {
            if (error) console.error('Supabase error deleting files:', error);
            return { success: !error, error };
          })
      );
    }
    
    // Update project's updated_at timestamp
    promises.push(
      supabase
        .from('ib_projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating project timestamp:', error);
          return { success: !error, error };
        })
    );
    
    const results = await Promise.all(promises);
    const errors = results.filter(result => !result.success).map(result => result.error);
    
    if (errors.length > 0) {
      throw new Error(`Errors occurred during file operations: ${errors.map(e => e.message).join(', ')}`);
    }
  },

  async updateProjectField(projectId: string, field: string, value: string) {
    console.log(`Updating ${field} for project:`, projectId);
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    updateData[field] = value;

    const { error } = await supabase
      .from('ib_projects')
      .update(updateData)
      .eq('id', projectId);

    if (error) {
      console.error(`Supabase error updating ${field}:`, error);
      throw error;
    }
  }
};
