
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, GitBranch, Copy, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface GitHubManagerProps {
  projectId: string;
}

const GitHubManager: React.FC<GitHubManagerProps> = ({ projectId }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [selectedProtocol, setSelectedProtocol] = useState<'https' | 'ssh' | 'gh'>('https');
  
  // Base repository information
  const repoOwner = 'intent-based-ai';
  const repoName = 'ibai-app';
  
  // Generate URLs based on selected protocol
  const getRepoUrl = () => {
    switch (selectedProtocol) {
      case 'https':
        return `https://github.com/${repoOwner}/${repoName}`;
      case 'ssh':
        return `git@github.com:${repoOwner}/${repoName}.git`;
      case 'gh':
        return `gh repo clone ${repoOwner}/${repoName}`;
      default:
        return `https://github.com/${repoOwner}/${repoName}`;
    }
  };
  
  const repoUrl = getRepoUrl();
  
  const handleConnect = () => {
    // In a real implementation, this would initiate OAuth flow with GitHub
    setIsConnected(true);
    setGithubUsername('adrianescutia');
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Repository URL copied to clipboard');
  };
  
  const handleProtocolChange = (protocol: 'https' | 'ssh' | 'gh') => {
    setSelectedProtocol(protocol);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">GitHub</CardTitle>
          <CardDescription>
            Sync your project 2-way with GitHub to collaborate at source. <a href="#" className="text-primary hover:underline">Learn more</a>
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Connected Account</CardTitle>
          <CardDescription>
            {isConnected 
              ? `Connected as ${githubUsername}`
              : 'Add your GitHub account to manage connected organizations.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleConnect}
            >
              <Github className="h-4 w-4" />
              Connect GitHub Account
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                {githubUsername}
              </div>
              <Button variant="ghost" size="sm">Disconnect</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isConnected && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Connected Organizations (Admin Only)</CardTitle>
              <CardDescription>
                Link GitHub organizations to transfer the project. Added organizations will be visible to all members in the workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button variant="outline">Manage</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Project</CardTitle>
              <CardDescription>
                Store your project on GitHub, with 2-way sync.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-500 text-white">
                    <span className="mr-1">●</span> Connected
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open(repoUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-medium">Branch Switching</CardTitle>
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <CardDescription>
                Choose the branch you want to work on.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  {selectedBranch}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Clone</CardTitle>
              <CardDescription>
                Copy the code to your local environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  value={repoUrl}
                  className="font-mono text-sm"
                  readOnly
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(repoUrl)}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Button 
                  variant={selectedProtocol === 'https' ? 'outline' : 'ghost'} 
                  size="sm"
                  onClick={() => handleProtocolChange('https')}
                >
                  HTTPS
                </Button>
                <Button 
                  variant={selectedProtocol === 'ssh' ? 'outline' : 'ghost'} 
                  size="sm"
                  onClick={() => handleProtocolChange('ssh')}
                >
                  SSH
                </Button>
                <Button 
                  variant={selectedProtocol === 'gh' ? 'outline' : 'ghost'} 
                  size="sm"
                  onClick={() => handleProtocolChange('gh')}
                >
                  GitHub CLI
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GitHubManager;
