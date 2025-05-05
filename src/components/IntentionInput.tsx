import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/context/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PromptTemplates from './PromptTemplates';
import { supabase } from '@/integrations/supabase/client';

const IntentionInput = () => {
  const [intention, setIntention] = useState('');
  const [placeholder, setPlaceholder] = useState('Type your intention here... (e.g., Create a todo app with React and local storage)');
  const [isLoading, setIsLoading] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const navigate = useNavigate();
  const { createProject, setCurrentProject } = useProjects();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create a project",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!intention.trim()) {
      toast({
        title: "Error",
        description: "Please enter your intention",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Initial empty project files structure
      const initialFiles = [
        {
          id: crypto.randomUUID(),
          name: 'README.md',
          path: '/',
          content: '# Project in progress\nYour project is being generated...',
          type: 'markdown'
        }
      ];
      
      // Create project in Supabase
      const { data: project, error } = await supabase
        .from('intent_based.projects')
        .insert({
          user_id: user.id,
          title: 'Project in progress...',
          description: 'Generating your project...',
          code_files: initialFiles,
          knowledge_context: intention.trim(),
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Create project locally and set as current
      const newProject = await createProject(
        project.title, 
        project.description || '', 
        project.code_files || initialFiles,
        project.id // Use the ID from Supabase
      );
      setCurrentProject(newProject);
      
      toast({
        title: "Project Created",
        description: "Your project is being generated",
      });
      
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: "Failed to create your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function will update the placeholder text as templates rotate
  const handleTemplatePlaceholderChange = (description: string) => {
    // if user already has text in the intention field, don't change the placeholder
    if (intention.trim()) return;
    setPlaceholder(description);
  };

  const handleIntentionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntention(e.target.value);
    if (e.target.value.trim()) {
      setUserHasInteracted(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={intention}
          onChange={handleIntentionChange}
          className="min-h-[120px] pr-24 resize-none text-lg"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add attachment</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="sm"
                  className="h-8"
                >
                  {isLoading ? 'Generating...' : 'Generate Project'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create a new project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <PromptTemplates 
        onSelectTemplate={(desc) => {
          setIntention(desc);
          setUserHasInteracted(true);
        }} 
        onTemplateChange={handleTemplatePlaceholderChange}
        userHasInteracted={userHasInteracted}
      />
    </div>
  );
};

export default IntentionInput;
