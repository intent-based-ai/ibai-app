
import { useState, useEffect } from 'react';
import IntentionInput from '@/components/IntentionInput';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/project';
import ProjectCard from '@/components/ProjectCard';

const HomePage = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const recentProjects = user ? projects.slice(0, 4) : [];
  
  const subheadings = [
    "Just describe what you want to build, and our AI will generate the code for you.",
    "Deliver faster, adapt faster, and crush the gap between vision and reality.",
    "Intent-based engine builds dynamic, self-adjusting MCP servers.",
    "One idea in. AI agents out. Smarter, faster, and ready to scale agents.",
    "Empower your creativity with MCP Agents generation.",
  ];
  
  const [currentSubheadingIndex, setCurrentSubheadingIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentSubheadingIndex((prevIndex) => (prevIndex + 1) % subheadings.length);
        setIsChanging(false);
      }, 500); // Wait for fade out animation before changing text
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="py-20 animated-gradient">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center text-white mb-10">
            <h1 className="text-4xl font-bold mb-4">
              Transform your ideas into MCP-based AI Agents with IB-AI
            </h1>
            <p className={`text-lg transition-opacity duration-500 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
              {subheadings[currentSubheadingIndex]}
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <IntentionInput />
          </div>
        </div>
      </section>
      
      {user && recentProjects.length > 0 && (
        <section className="py-16 container">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
      
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-medium mb-2">Describe Your Idea</h3>
                <p className="text-muted-foreground">
                  Tell us what you want to build using natural language
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium mb-2">AI Generates Code</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your request and creates the code structure
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-medium mb-2">Edit & Export</h3>
                <p className="text-muted-foreground">
                  Customize the code and export your project
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
