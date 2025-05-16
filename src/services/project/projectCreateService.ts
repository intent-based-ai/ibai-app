
import { supabase } from '@/integrations/supabase/client';
import { File } from '@/types/project';
import { encodeFileContent } from './projectUtils';

export const projectCreateService = {
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
        manifest_id: '00000000-0000-0000-0000-000000000000', // Default manifest ID
        path: file.path,
        type: file.type,
        content: encodeFileContent(file.content),
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
  }
};
