
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

const IntentionInput = () => {
  const [intention, setIntention] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      // In a real app, this would be an API call to generate code
      // For now, let's create a mock project with some sample files
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockFiles = [
        {
          id: crypto.randomUUID(),
          name: 'index.html',
          path: '/',
          content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script src="index.js"></script>\n</body>\n</html>',
          type: 'html'
        },
        {
          id: crypto.randomUUID(),
          name: 'index.js',
          path: '/',
          content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));',
          type: 'javascript'
        },
        {
          id: crypto.randomUUID(),
          name: 'App.js',
          path: '/',
          content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;',
          type: 'javascript'
        }
      ];
      
      const projectTitle = intention.slice(0, 30) + (intention.length > 30 ? '...' : '');
      const newProject = await createProject(projectTitle, intention, mockFiles);
      setCurrentProject(newProject);
      
      toast({
        title: "Success!",
        description: "Your project has been created",
      });
      
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Failed to process intention:', error);
      toast({
        title: "Error",
        description: "Failed to process your intention. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Textarea
          placeholder="Type your intention here... (e.g., 'Create a todo app with React and local storage')"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
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
      <PromptTemplates onSelectTemplate={setIntention} />
    </div>
  );
};

export default IntentionInput;

