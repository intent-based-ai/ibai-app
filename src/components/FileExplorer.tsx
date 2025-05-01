
import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Plus, 
  Settings,
  Download,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/ProjectContext';
import { type Project } from '@/types/project';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface FileExplorerProps {
  project: Project;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  project, 
  activeFileId, 
  onSelectFile 
}) => {
  const { addFile } = useProjects();
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('javascript');
  
  const handleAddFile = () => {
    if (!newFileName) {
      toast({
        title: "Error",
        description: "File name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Check if file already exists
    if (project.files.some(file => file.name === newFileName)) {
      toast({
        title: "Error",
        description: "A file with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    const fileExtension = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
    }[newFileType];
    
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${fileExtension}`;
    
    addFile(project.id, {
      name: fileName,
      path: '/',
      content: '',
      type: newFileType
    });
    
    setIsAddingFile(false);
    setNewFileName('');
    
    toast({
      title: "Success",
      description: `${fileName} has been added`,
    });
  };
  
  const handleExportZip = () => {
    toast({
      title: "Export initiated",
      description: "Your project is being prepared for download",
    });
    
    // In a real app, this would generate and download a zip file
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Your project has been exported successfully",
      });
    }, 1500);
  };
  
  const handleExportGithub = () => {
    toast({
      title: "GitHub export",
      description: "GitHub integration is in progress",
    });
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium">Files</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsAddingFile(true)}>
            <Plus className="h-4 w-4" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Project Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Export Project</Label>
                  <div className="flex gap-2">
                    <Button onClick={handleExportZip} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP
                    </Button>
                    <Button onClick={handleExportGithub} variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      Export to GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={isAddingFile} onOpenChange={setIsAddingFile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                placeholder="Enter file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filetype">File Type</Label>
              <Select 
                value={newFileType} 
                onValueChange={setNewFileType}
              >
                <SelectTrigger id="filetype">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddFile} className="w-full">
              Add File
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="overflow-auto flex-1 p-2">
        <div className="space-y-1">
          {project.files.map((file) => (
            <button
              key={file.id}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md ${
                file.id === activeFileId 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelectFile(file.id)}
            >
              <FileText className="h-4 w-4" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
