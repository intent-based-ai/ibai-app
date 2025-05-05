
import { createContext } from 'react';
import { ProjectContextValue } from './types';

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export default ProjectContext;
