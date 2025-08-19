import React from 'react';
import type { Project } from '../types';
import GlassCard from './ui/GlassCard';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
  index: number;
  isDesktop: boolean;
  activeIndex?: number;
  totalProjects?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, index, activeIndex, totalProjects, isDesktop }) => {
  if (isDesktop) {
    return <DesktopProjectCard project={project} onSelect={onSelect} />
  }
  return <MobileProjectCard project={project} onSelect={onSelect} index={index} activeIndex={activeIndex!} totalProjects={totalProjects!} />
}

const DesktopProjectCard = ({ project, onSelect }) => (
    <div 
        className="w-full h-96 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        onClick={onSelect}
    >
        <GlassCard
          className="w-full h-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${project.mainImage})`, backgroundBlendMode: 'overlay' }}
        >
          <div className="relative w-full h-full flex flex-col justify-between p-5 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-right">
                <p className="text-2xl font-bold text-white">{project.year}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide truncate text-white">{project.projectName}</h3>
              <p className="text-xs opacity-80 text-slate-300">{project.location}</p>
              <div className="mt-4">
                <StatusIndicator status={project.status} />
              </div>
            </div>
          </div>
        </GlassCard>
    </div>
)

const MobileProjectCard: React.FC<Omit<ProjectCardProps, 'isDesktop'> & { activeIndex: number, totalProjects: number }> = ({ project, onSelect, index, activeIndex, totalProjects }) => {
  const anglePerCard = 360 / totalProjects;
  const cardAngle = index * anglePerCard;
  const offset = index - activeIndex;
  const distance = Math.min(Math.abs(offset), totalProjects - Math.abs(offset));

  const radius = window.innerWidth < 768 ? 200 : 380; // Adjusted radius based on new image

  // The transform now includes scale and is applied directly to the card container
  const containerTransform = `
    rotateY(${cardAngle}deg) 
    translateZ(${radius}px) 
    scale(${1 - distance * 0.15})
  `;

  // The transform now includes the centering translation
  const finalTransform = `translateX(-50%) translateY(-50%) ${containerTransform}`;

  const containerStyle: React.CSSProperties = {
    transform: finalTransform,
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '16rem',
    height: '24rem',
    // The brittle margin centering is removed
    transition: 'transform 0.7s ease-out, opacity 0.7s ease-out',
    zIndex: totalProjects - distance,
    opacity: 1 - distance * 0.3,
    backfaceVisibility: 'hidden',
    pointerEvents: distance === 0 ? 'auto' : 'none',
  };

  // The inner div no longer has any transforms
  return (
    <div style={containerStyle} onClick={distance === 0 ? onSelect : undefined}>
        <GlassCard
          className="w-full h-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${project.mainImage})` }}
        >
          <div className="relative w-full h-full flex flex-col justify-between p-5 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-right">
                <p className="text-2xl font-bold text-white">{project.year}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide truncate text-white">{project.projectName}</h3>
              <p className="text-xs opacity-80 text-slate-300">{project.location}</p>
              <div className="mt-4">
                <StatusIndicator status={project.status} />
              </div>
            </div>
          </div>
        </GlassCard>
    </div>
  );
};

const StatusIndicator = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    let colorClass = 'bg-gray-400';
    if (lowerStatus === 'terminado' || lowerStatus === 'completed') colorClass = 'bg-green-400';
    else if (lowerStatus === 'en construcción' || lowerStatus === 'under construction') colorClass = 'bg-orange-400';
    else if (lowerStatus === 'diseño' || lowerStatus === 'design') colorClass = 'bg-blue-400';
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
            <span className="text-sm font-medium text-slate-200">{status}</span>
        </div>
    );
}

export default ProjectCard;