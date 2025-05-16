
import { supabase } from '@/integrations/supabase/client';
import { File } from '@/types/project';
import { encodeFileContent } from './projectUtils';

export const projectFileService = {
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
          content: encodeFileContent(file.content),
          updated_at: new Date().toISOString()
        });
      } else {
        // Insert new file
        filesToInsert.push({
          project_id: projectId,
          manifest_id: '00000000-0000-0000-0000-000000000000', // Default manifest ID
          path: file.path,
          type: file.type,
          content: encodeFileContent(file.content),
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
  }
};
