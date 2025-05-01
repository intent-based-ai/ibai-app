
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProjects } from '@/context/ProjectContext';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import KnowledgeManager from '@/components/KnowledgeManager';
import GitHubManager from '@/components/GitHubManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, BookOpen, Github } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, currentProject, setCurrentProject, loading } = useProjects();
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'knowledge' | 'github'>('code');
  const [localLoading, setLocalLoading] = useState(true);
  
  useEffect(() => {
    console.log('ProjectDetailPage mounted with projectId:', projectId);
    console.log('Current projects:', projects);
    
    if (projectId) {
      setLocalLoading(true);
      // Find the project in the projects array
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        console.log('Found project:', project);
        setCurrentProject(project);
        
        // Set the first file as active if there are files and none is selected
        if (project.files.length > 0 && !activeFileId) {
          setActiveFileId(project.files[0].id);
        }
      } else {
        console.log('Project not found in projects array');
      }
      setLocalLoading(false);
    }
    
    // Cleanup when component unmounts
    return () => {
      setCurrentProject(null);
    };
  }, [projectId, projects, setCurrentProject]);
  
  if (loading || localLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!projectId || (!loading && !localLoading && !currentProject)) {
    console.log('Redirecting: projectId or currentProject missing', { projectId, currentProject });
    return <Navigate to="/projects" />;
  }
  
  const activeFile = currentProject?.files.find(file => file.id === activeFileId);
  
  const getLanguage = (file: { name: string, type: string }) => {
    if (file.type) return file.type;
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="border-b p-4">
        <h1 className="text-xl font-bold line-clamp-1">{currentProject?.title || 'Project'}</h1>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {currentProject?.description || 'No description'}
        </p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 overflow-hidden">
          {currentProject && (
            <FileExplorer 
              project={currentProject} 
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
            />
          )}
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b p-2">
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => setActiveTab(v as 'code' | 'knowledge' | 'github')}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="code" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Knowledge
                </TabsTrigger>
                <TabsTrigger value="github" className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  GitHub
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="code" className="mt-0 h-full">
                {activeFile ? (
                  <CodeEditor
                    projectId={currentProject!.id}
                    fileId={activeFile.id}
                    initialContent={activeFile.content}
                    language={getLanguage(activeFile)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a file from the explorer or create a new one
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="knowledge" className="mt-0 h-full">
                {currentProject && (
                  <KnowledgeManager
                    projectId={currentProject.id}
                    initialContext={currentProject.customContext}
                    initialInstructions={currentProject.customInstructions}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="github" className="mt-0 h-full">
                {currentProject && (
                  <GitHubManager projectId={currentProject.id} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
