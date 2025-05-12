
import { supabase } from '@/integrations/supabase/client';
import { Project, File } from '@/types/project';

export const projectService = {
  async fetchProjects() {
    const { data, error } = await supabase
      .from('ib_projects')
      .select('*')
      .order('updated_at', { ascending: false });
    console.log('Fetched projects from Supabase:', data, error);

    if (error) {
      console.error('Supabase error fetching projects:', error);
      throw error;
    }

    return (data || []).map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      files: project.code_files || [],
      name: project.title,
      knowledge_context: project.knowledge_context || '',
      knowledge_instructions: project.knowledge_instructions || '',
      customContext: project.knowledge_context || '',
      customInstructions: project.knowledge_instructions || '',
      created_at: project.created_at,
      updated_at: project.updated_at
    }));
  },

  async saveProject(project: Project) {
    console.log('Saving project to Supabase:', project.id);
    const { error } = await supabase
      .from('ib_projects')
      .update({
        title: project.title,
        description: project.description,
        code_files: project.files,
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
    const newProject = {
      title,
      description,
      code_files: files || [],
      user_id: userId,
      knowledge_context: context || '',
      knowledge_instructions: instructions || '',
    };

    const { data, error } = await supabase
      .from('ib_projects')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating project:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      name: data.title,
      files: data.code_files || [],
      knowledge_context: data.knowledge_context || '',
      knowledge_instructions: data.knowledge_instructions || '',
      customContext: data.knowledge_context || '',
      customInstructions: data.knowledge_instructions || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async updateFile(projectId: string, updatedFiles: File[]) {
    console.log('Updating files for project:', projectId);
    const { error } = await supabase
      .from('ib_projects')
      .update({
        code_files: updatedFiles,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) {
      console.error('Supabase error updating files:', error);
      throw error;
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
