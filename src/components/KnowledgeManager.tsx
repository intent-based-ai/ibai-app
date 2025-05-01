
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/context/ProjectContext';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface KnowledgeManagerProps {
  projectId: string;
  initialContext?: string;
  initialInstructions?: string;
}

const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({
  projectId,
  initialContext = '',
  initialInstructions = ''
}) => {
  const [context, setContext] = useState(initialContext);
  const [instructions, setInstructions] = useState(initialInstructions);
  const { updateProjectContext, updateProjectInstructions } = useProjects();

  const handleSaveContext = () => {
    updateProjectContext(projectId, context);
    toast({
      title: "Context Saved",
      description: "Your custom context has been updated"
    });
  };

  const handleSaveInstructions = () => {
    updateProjectInstructions(projectId, instructions);
    toast({
      title: "Instructions Saved",
      description: "Your custom instructions have been updated"
    });
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs defaultValue="context">
        <div className="bg-muted p-2">
          <TabsList>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="context" className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Custom context helps IB-AI understand your project better. Add domain-specific knowledge, 
            documentation references, or other information that will help generate better code.
          </p>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add custom context here..."
            className="min-h-[200px]"
          />
          <Button onClick={handleSaveContext} disabled={true}>
            <Save className="h-4 w-4 mr-2" />
            Save Context
          </Button>
        </TabsContent>
        
        <TabsContent value="instructions" className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Custom instructions tell IB-AI how to generate and modify code for your project. 
            Define coding style preferences, architectural patterns, or other guidelines.
          </p>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Add custom instructions here..."
            className="min-h-[200px]"
          />
          <Button onClick={handleSaveInstructions} disabled={true}>
            <Save className="h-4 w-4 mr-2" />
            Save Instructions
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeManager;
