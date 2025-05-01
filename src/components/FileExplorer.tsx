import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown,
  Plus, 
  Settings,
  Download,
  Github,
  FolderPlus,
  FileJson,
  FileArchive,
  FileCode,
  FileTerminal,
  FilePenLine,
  Braces,
  SquareChartGantt,
  CodeXml,
  Worm
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/ProjectContext';
import { type Project, File } from '@/types/project';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FileExplorerProps {
  project: Project;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
}

interface FileTreeItem {
  id: string;
  name: string;
  path: string;
  type: string;
  isDirectory?: boolean;
  children?: FileTreeItem[];
  content?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  project, 
  activeFileId, 
  onSelectFile 
}) => {
  const { addFile } = useProjects();
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileType, setNewFileType] = useState('javascript');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  // Build file tree structure from flat file list
  const fileTree = useMemo(() => {
    const tree: FileTreeItem[] = [];
    const map: Record<string, FileTreeItem> = {};
    
    // Normalize paths to ensure consistent format (with leading slash)
    const normalizedFiles = project.files.map(file => ({
      ...file,
      path: file.path.startsWith('/') ? file.path : `/${file.path}`
    }));
    
    // First create all directories
    normalizedFiles
      .filter(file => file.isDirectory)
      .sort((a, b) => a.path.split('/').length - b.path.split('/').length) // Process by depth
      .forEach(file => {
        const item: FileTreeItem = {
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type,
          isDirectory: true,
          children: []
        };
        
        map[file.path] = item;
        
        const pathParts = file.path.split('/').filter(Boolean);
        
        if (pathParts.length <= 1) {
          // This is a root directory
          tree.push(item);
        } else {
          // This is a subdirectory
          const parentDirName = pathParts.slice(0, -1);
          const parentPath = '/' + parentDirName.join('/');
          
          if (map[parentPath] && map[parentPath].children) {
            map[parentPath].children?.push(item);
          } else {
            // If parent not found, add to root
            tree.push(item);
          }
        }
      });
    
    // Then add all files
    normalizedFiles
      .filter(file => !file.isDirectory)
      .forEach(file => {
        const item: FileTreeItem = {
          id: file.id,
          name: file.name,
          path: file.path,
          type: file.type,
          isDirectory: false,
          content: file.content
        };
        
        map[file.path] = item;
        
        const pathParts = file.path.split('/').filter(Boolean);
        
        if (pathParts.length <= 1) {
          // This is a file in the root
          tree.push(item);
        } else {
          // This file belongs in a subdirectory
          const parentDirName = pathParts.slice(0, -1);
          const parentPath = '/' + parentDirName.join('/');
          
          if (map[parentPath] && map[parentPath].children) {
            map[parentPath].children?.push(item);
          } else {
            // If parent directory not found, add to root
            tree.push(item);
          }
        }
      });
    
    return tree;
  }, [project.files]);
  
  const toggleFolder = (path: string) => {
    const newExpandedFolders = new Set(expandedFolders);
    if (expandedFolders.has(path)) {
      newExpandedFolders.delete(path);
    } else {
      newExpandedFolders.add(path);
    }
    setExpandedFolders(newExpandedFolders);
  };
  
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
      path: fileName,
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
  
  const handleAddFolder = () => {
    if (!newFolderName) {
      toast({
        title: "Error",
        description: "Folder name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Check if folder already exists
    if (project.files.some(file => file.name === newFolderName && file.isDirectory)) {
      toast({
        title: "Error",
        description: "A folder with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    addFile(project.id, {
      name: newFolderName,
      path: `${newFolderName}`,
      content: '',
      type: 'directory',
      isDirectory: true
    });
    
    setIsAddingFolder(false);
    setNewFolderName('');
    
    toast({
      title: "Success",
      description: `Folder ${newFolderName} has been added`,
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
  
  const renderFileTreeItem = (item: FileTreeItem) => {
    const isExpanded = expandedFolders.has(item.path);
    
    if (item.isDirectory) {
      return (
        <div key={item.id} className="select-none">
          <div 
            className={`flex items-center gap-1 px-2 py-1.5 text-sm rounded-md hover:bg-muted cursor-pointer`}
            onClick={() => toggleFolder(item.path)}
          >
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 shrink-0" /> : 
              <ChevronRight className="h-4 w-4 shrink-0" />
            }
            <Folder className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="truncate">{item.name}</span>
          </div>
          
          {isExpanded && item.children && (
            <div className="ml-4 pl-2 border-l border-border">
              {item.children.map(child => renderFileTreeItem(child))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={item.id}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer",
            item.id === activeFileId 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted'
          )}
          onClick={() => onSelectFile(item.id)}
        >
          {item.type === 'json' && <FileJson className="h-4 w-4 shrink-0 text-green-500" />}
          {item.type === 'javascript' && <FileCode className="h-4 w-4 shrink-0 text-yellow-500" />}
          {item.type === 'typescript' && <FileCode className="h-4 w-4 shrink-0 text-blue-500" />}
          {item.type === 'css' && <FileCode className="h-4 w-4 shrink-0 text-pink-500" />}
          {item.type === 'html' && <CodeXml className="h-4 w-4 shrink-0 text-orange-500" />}
          {item.type === 'markdown' && <FilePenLine className="h-4 w-4 shrink-0 text-purple-500" />}
          {item.type === 'yaml' && <SquareChartGantt className="h-4 w-4 shrink-0 text-cyan-500" />}
          {item.type === 'python' && <Worm className="h-4 w-4 shrink-0 text-blue-700" />}
          {item.type === 'shell' && <FileTerminal className="h-4 w-4 shrink-0 text-gray-500" />}
          {item.type === 'zip' && <FileArchive className="h-4 w-4 shrink-0 text-amber-600" />}
          {item.type === 'c' && <Braces className="h-4 w-4 shrink-0 text-blue-800" />}
          {item.type === 'java' && <Braces className="h-4 w-4 shrink-0 text-red-500" />}
          {/* Fallback for other file types */}
          {!['json', 'javascript', 'typescript', 'css', 'html', 'markdown', 'yaml', 'python', 'shell', 'zip', 'c', 'java'].includes(item.type) && 
            <FileText className="h-4 w-4 shrink-0" />
          }
          <span className="truncate">{item.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium">Files</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsAddingFile(true)} title="Add File">
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setIsAddingFolder(true)} title="Add Folder">
            <FolderPlus className="h-4 w-4" />
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
                  <SelectItem value="yaml">YAML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddFile} className="w-full">
              Add File
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="foldername">Folder Name</Label>
              <Input
                id="foldername"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <Button onClick={handleAddFolder} className="w-full">
              Add Folder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="overflow-auto flex-1 p-2">
        <div className="space-y-1">
          {fileTree.map(item => renderFileTreeItem(item))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
