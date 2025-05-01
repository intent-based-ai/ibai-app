
import { Project } from "@/types/project";

export const useMockProjects = () => {
  const generateMockProjects = (email: string): Project[] | null => {
    if (email === 'adrian@rebelion.la') {
      return [
        {
          id: crypto.randomUUID(),
          title: 'Portfolio Website',
          description: 'Personal portfolio showcasing my web development skills',
          files: [
            { 
              id: crypto.randomUUID(), 
              name: 'index.tsx', 
              path: 'src/index.tsx', 
              content: '// React component for portfolio homepage', 
              type: 'tsx' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'styles.css', 
              path: 'src/styles.css', 
              content: '/* Styling for portfolio site */', 
              type: 'css' 
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          title: 'Task Management App',
          description: 'Simple task tracking and productivity application',
          files: [
            { 
              id: crypto.randomUUID(), 
              name: 'TaskList.tsx', 
              path: 'src/components/TaskList.tsx', 
              content: '// Component for displaying tasks', 
              type: 'tsx' 
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    return null;
  };

  return { generateMockProjects };
};
