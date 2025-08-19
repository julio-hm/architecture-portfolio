import React from 'react';
import type { Project } from '../types';
import ProjectCard from './ProjectCard';
import DonutChart from './ui/DonutChart';
import GlassCard from './ui/GlassCard';

const Dashboard: React.FC<{ projects: Project[]; onSelectProject: (project: Project) => void; }> = ({ projects, onSelectProject }) => {
  
  const projectCategories = projects.reduce((acc, project) => {
    const category = project.category || 'Otros';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(projectCategories).map(([name, value]) => ({ name, value }));

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('/87aa6b8f3aff34b836e4592a4de1d209.jpg')" }}
    >
      <div className="min-h-screen w-full bg-black/50 backdrop-blur-sm">
        <header className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="ADAD Logo" className="h-10 w-auto" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider">ADAD</h1>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Columna de Proyectos */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
                ))}
              </div>
            </div>

            {/* Columna Lateral */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Categorías de proyectos</h2>
                <DonutChart data={chartData} />
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;