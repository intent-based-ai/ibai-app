
import { projectFetchService } from './projectFetchService';
import { projectCreateService } from './projectCreateService';
import { projectUpdateService } from './projectUpdateService';
import { projectFileService } from './projectFileService';

export const projectService = {
  ...projectFetchService,
  ...projectCreateService,
  ...projectUpdateService,
  ...projectFileService
};
