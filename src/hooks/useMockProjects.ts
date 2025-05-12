
import { Project } from "@/types/project";

export const useMockProjects = () => {
  const generateMockProjects = (email: string): Project[] | null => {
    // Add more demo emails here if needed
    if (email === 'adrian@rebelion.la' || email === 'demo@lovable.dev') {
      // Generate a consistent ID for mock projects
      const getMockId = (seed: string) => `mock-${seed}-${btoa(email).slice(0, 8)}`;
      
      return [
        {
          id: getMockId('real-estate'),
          title: 'Real Estate Team',
          description: 'Create a team of agents that can help me sell my house.',
          customContext: 'My house is in a suburban area with good schools and parks nearby, ZIP 75115.',
          customInstructions: 'Create a team of agents that can help me sell my house.',
          knowledge_context: 'My house is in a suburban area with good schools and parks nearby, ZIP 75115.',
          knowledge_instructions: 'Create a team of agents that can help me sell my house.',
          files: [
            {
              id: crypto.randomUUID(),
              name: 'server.yaml',
              path: '/server.yaml',
              content: '# intent-based ai agents for real estate',
              type: 'yaml'
            },
            {
              id: crypto.randomUUID(),
              name: 'typescript',
              path: '/typescript',
              type: 'directory',
              isDirectory: true
            },
            {
              id: crypto.randomUUID(),
              name: 'README.md',
              path: '/typescript/README.md',
              isDirectory: false,
              content: '# Real Estate AI Team\n\nA team of agents to assist with selling houses.',
              type: 'markdown'
            },
            {
              id: crypto.randomUUID(),
              name: 'package.json',
              path: '/typescript/package.json',
              content: '{\n  "name": "real-estate-team",\n  "version": "1.0.0"\n}',
              type: 'json'
            },
            {
              id: crypto.randomUUID(),
              name: 'src',
              path: '/typescript/src',
              isDirectory: true,
              type: 'directory'
            },
            {
              id: crypto.randomUUID(),
              name: 'tools',
              path: '/typescript/src/tools',
              isDirectory: true,
              type: 'directory'
            },
            {
              id: crypto.randomUUID(),
              name: 'property.ts',
              path: '/typescript/src/tools/property.ts',
              content: '// Property management tools',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'market.ts',
              path: '/typescript/src/tools/market.ts',
              content: '// Market analysis tools',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'index.ts',
              path: '/typescript/src/index.ts',
              content: '// Main entry point for the application',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'agents',
              path: '/typescript/src/agents',
              isDirectory: true,
              type: 'directory'
            },
            {
              id: crypto.randomUUID(),
              name: 'seller.ts',
              path: '/typescript/src/agents/seller.ts',
              content: '// Seller agent implementation',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'buyer.ts',
              path: '/typescript/src/agents/buyer.ts',
              content: '// Buyer agent implementation',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'tsconfig.json',
              path: '/typescript/tsconfig.json',
              content: '{\n  "compilerOptions": {\n    "target": "ES2020"\n  }\n}',
              type: 'json'
            }
          ],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()  // 2 days ago
        },
        {
          id: getMockId('task-manager'),
          title: 'Task Management App',
          description: 'Simple task tracking and productivity application',
          customContext: '',
          customInstructions: '',
          knowledge_context: '',
          knowledge_instructions: '',
          files: [
            {
              id: crypto.randomUUID(),
              name: 'package.json',
              path: '/package.json',
              content: '{\n  "name": "task-manager",\n  "version": "1.0.0"\n}',
              type: 'json'
            },
            {
              id: crypto.randomUUID(),
              name: 'bunup.config.ts',
              path: '/bunup.config.ts',
              content: 'export default {\n  // bunup configuration\n};',
              type: 'typescript'
            },
            {
              id: crypto.randomUUID(),
              name: 'src',
              path: '/src',
              isDirectory: true,
              type: 'directory'
            },
            {
              id: crypto.randomUUID(),
              name: 'index.ts',
              path: '/src/index.ts',
              content: '// Task manager entry point',
              type: 'typescript'
            }
          ],
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()   // 5 days ago
        }
      ];
    }
    return null;
  };

  return { generateMockProjects };
};
