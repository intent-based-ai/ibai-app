
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PromptTemplate {
  summary: string;
  description: string;
}

const templates: PromptTemplate[] = [
  {
    summary: "Career coach agent",
    description: "Create a career coaching agent that can help me find a job."
  },
  {
    summary: "Sale house agent",
    description: "Create a team of agents to help me sell my house."
  },
  {
    summary: "Personal trainer agent",
    description: "Build a fitness coaching agent that can create personalized workout plans."
  },
  {
    summary: "Marketing strategy agent",
    description: "Create a team of agents that can help me with my marketing strategy."
  }
];

interface PromptTemplatesProps {
  onSelectTemplate: (description: string) => void;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleRotate = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-muted-foreground">Prompt templates:</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => onSelectTemplate(templates[currentIndex].description)}
            >
              {templates[currentIndex].summary}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{templates[currentIndex].description}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        size="icon"
        className="p-0 h-8 w-8"
        onClick={handleRotate}
      >
        <CircleChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PromptTemplates;

