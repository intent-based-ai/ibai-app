
import React, { useEffect } from 'react';
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
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate, onTemplateChange }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % templates.length;
        onTemplateChange(templates[nextIndex].description);
        return nextIndex;
      });
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [onTemplateChange]);

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-muted-foreground">Prompt templates:</span>
      <Carousel className="max-w-xs">
        <CarouselContent>
          {templates.map((template, index) => (
            <CarouselItem key={index} className={index === currentIndex ? 'block' : 'hidden'}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => onSelectTemplate(template.description)}
                    >
                      {template.summary}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{template.description}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromptTemplates;
