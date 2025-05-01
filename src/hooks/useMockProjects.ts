
import { Project } from "@/types/project";

export const useMockProjects = () => {
  const generateMockProjects = (email: string): Project[] | null => {
    if (email === 'adrian@rebelion.la') {
      return [
        {
          id: crypto.randomUUID(),
          title: 'Real Estate team',
          description: 'Create a team of agents that can help me sell my house.',
          files: [
            { 
              id: crypto.randomUUID(), 
              name: 'README.md', 
              path: 'README.md', 
              content: '# Real Estate AI Team\n\nA team of agents to assist with selling houses.', 
              type: 'markdown' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'server.yaml', 
              path: 'server.yaml', 
              content: '# intent-based ai agents for real estate', 
              type: 'yaml' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'package.json', 
              path: 'package.json', 
              content: '{\n  "name": "real-estate-team",\n  "version": "1.0.0"\n}', 
              type: 'json' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'index.ts', 
              path: 'src/index.ts', 
              content: '// Main entry point for the application', 
              type: 'typescript' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'tsconfig.json', 
              path: 'tsconfig.json', 
              content: '{\n  "compilerOptions": {\n    "target": "ES2020"\n  }\n}', 
              type: 'json' 
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
              name: 'package.json', 
              path: 'package.json', 
              content: '{\n  "name": "task-manager",\n  "version": "1.0.0"\n}', 
              type: 'json' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'bunup.config.ts', 
              path: 'bunup.config.ts', 
              content: 'export default {\n  // bunup configuration\n};', 
              type: 'typescript' 
            },
            { 
              id: crypto.randomUUID(), 
              name: 'index.ts', 
              path: 'src/index.ts', 
              content: '// Task manager entry point', 
              type: 'typescript' 
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
