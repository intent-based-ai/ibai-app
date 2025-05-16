
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

export const projectUpdateService = {
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
