
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/ProjectContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Save, Trash2 } from 'lucide-react';

interface CodeEditorProps {
  projectId: string;
  fileId: string;
  initialContent: string;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  projectId, 
  fileId, 
  initialContent, 
  language 
}) => {
  const [content, setContent] = useState(initialContent);
  const { updateFile, deleteFile } = useProjects();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    updateFile(projectId, fileId, content);
    toast({
      title: "Saved",
      description: "Your changes have been saved",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      deleteFile(projectId, fileId);
      toast({
        title: "Deleted",
        description: "File has been deleted",
      });
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'code' | 'preview')}>
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview" disabled={!['html', 'markdown'].includes(language)}>
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="code" className="m-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full font-code text-sm p-4 code-editor"
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="preview" className="m-0">
          {language === 'html' && (
            <div 
              className="p-4 h-[300px] overflow-auto" 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          )}
          {language === 'markdown' && (
            <div className="p-4 prose max-w-none">
              {/* In a real app, you would render markdown here */}
              <pre>{content}</pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
