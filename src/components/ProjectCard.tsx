import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { type Project } from '@/types/project';
import { FileCode, Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {  
  return (
    <Link to={`/project/${project.id}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {project.description}
          </p>
          <div className="flex items-center text-xs text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <FileCode className="h-3.5 w-3.5" />
              <span>{project.files.length} files</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated {formatDistanceToNow(new Date(project.updated_at))} ago</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {project.files.slice(0, 3).map(file => (
              <Badge key={file.id} variant="secondary">
                {file.name}
              </Badge>
            ))}
            {project.files.length > 3 && (
              <Badge variant="outline">+{project.files.length - 3} more</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
