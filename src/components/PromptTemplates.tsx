import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CircleChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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
  onTemplateChange: (description: string) => void;
  userHasInteracted?: boolean;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ 
  onSelectTemplate, 
  onTemplateChange,
  userHasInteracted = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldRotate, setShouldRotate] = useState(true);

  // Stop rotation if user has interacted
  useEffect(() => {
    if (userHasInteracted) {
      setShouldRotate(false);
    }
  }, [userHasInteracted]);

  useEffect(() => {
    if (!shouldRotate) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % templates.length;
        onTemplateChange(templates[nextIndex].description);
        return nextIndex;
      });
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [shouldRotate, onTemplateChange]);

  return (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {templates.map((template, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={index === currentIndex ? "default" : "outline"}
                className={`text-sm transition-all ${index === currentIndex ? 'scale-105' : 'opacity-70'}`}
                onClick={() => {
                  onSelectTemplate(template.description);
                  setCurrentIndex(index);
                  setShouldRotate(false); // Stop rotation when user selects a template
                }}
              >
                {template.summary}
                {index === currentIndex && (
                  <CircleChevronRight className="ml-1 h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{template.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default PromptTemplates;
