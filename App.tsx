import React, { useState, useEffect, useMemo } from 'react';
import type { Project } from './types';
import { fetchProjects } from './services/googleSheetService';
import Loader from './components/ui/Loader';
import ProjectCard from './components/ProjectCard';
import ProjectDetailView from './components/ProjectDetailView';
import DonutChart from './components/ui/DonutChart';
import nuevoLogo from '/LOGO EJEMP.png';
import nombreLogo from '/LOGO ADAD5.png';

// --- Hooks ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


// --- Data Processing ---
const getCategoryData = (projects: Project[]) => {
    const categoryCounts = projects.reduce((acc, project) => {
        const category = project.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
};


// --- Views ---
const CarouselPagination: React.FC<{ count: number, activeIndex: number }> = ({ count, activeIndex }) => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: count }).map((_, i) => (
            <div 
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white/90' : 'bg-white/40'}`} 
            />
        ))}
    </div>
);

const CarouselView = ({ projects, onCardClick, activeIndex, isDragging, dragOffset, handlers }) => {
    const anglePerCard = 360 / (projects.length || 1);
    const targetRotation = -activeIndex * anglePerCard;
    // Reduced drag sensitivity for a more subtle, professional feel
    const dragRotation = (dragOffset / window.innerWidth) * 60; 
    const totalRotation = targetRotation + dragRotation;

    return (
        <div 
            className="relative z-10 h-full w-full"
            style={{ touchAction: 'pan-y' }} // Prevent page scroll on drag
            {...handlers}
        >
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px', perspectiveOrigin: 'center center' }}>
                <div 
                    className="relative w-full h-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${totalRotation}deg) translateZ(0px)`,
                      transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                >
                    {projects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index}
                            activeIndex={activeIndex}
                            totalProjects={projects.length}
                            onSelect={() => onCardClick(index)} 
                            isDesktop={false}
                        />
                    ))}
                </div>
            </div>
            <CarouselPagination count={projects.length} activeIndex={activeIndex} />
        </div>
    )
}

const ProjectGridView: React.FC<{ projects: Project[], onCardClick: (index: number) => void, categoryData: { name: string, value: number }[] }> = ({ projects, onCardClick, categoryData }) => (
    <div className="relative z-10 w-full h-full p-4 sm:p-8 md:p-12 pt-40 md:pt-48">
        <div className="mb-8 md:mb-12 p-4 sm:p-6 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Resumen de Proyectos</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex-grow p-3 sm:p-4 bg-black/20 rounded-lg border border-white/10 min-w-[120px]">
                    <p className="text-slate-300 text-xs sm:text-sm">Total de Proyectos</p>
                    <p className="text-white text-xl sm:text-2xl font-bold">{projects.length}</p>
                </div>
                {categoryData.map(cat => (
                    <div key={cat.name} className="flex-grow p-3 sm:p-4 bg-black/20 rounded-lg border border-white/10 min-w-[120px]">
                        <p className="text-slate-300 text-xs sm:text-sm">{cat.name}</p>
                        <p className="text-white text-xl sm:text-2xl font-bold">{cat.value}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {projects.map((project, index) => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                    onSelect={() => onCardClick(index)} 
                    isDesktop={true}
                />
            ))}
        </div>
    </div>
);


const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // --- Drag state ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isClick, setIsClick] = useState(true);

  const isDesktop = useMediaQuery('(min-width: 1024px)'); // Changed to lg breakpoint

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
    return () => clearTimeout(timer);
  }, []);

  const categoryData = useMemo(() => getCategoryData(projects), [projects]);

  const handleCardClick = (index: number) => {
      setSelectedProject(projects[index]);
  };

  const handleCloseDetail = () => {
    setSelectedProject(null);
  };

  // --- Drag Handlers ---
  const handleDragStart = (clientX: number) => {
    if(isDesktop) return;
    setIsDragging(true);
    setIsClick(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if(isDesktop || !isDragging) return;
    const offset = clientX - startX;
    setDragOffset(offset);
    if (Math.abs(offset) > 5) {
      setIsClick(false);
    }
  };

  const handleDragEnd = () => {
    if (isDesktop || !isDragging) return;
    setIsDragging(false);

    // A swipe is triggered if the user drags more than 60 pixels
    const swipeThreshold = 60; 

    if (dragOffset < -swipeThreshold) { // Swiped left, go to next project
      setActiveIndex((prev) => (prev + 1) % projects.length);
    } else if (dragOffset > swipeThreshold) { // Swiped right, go to previous project
      setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
    // If the drag was less than the threshold, the carousel will snap back to the activeIndex.

    // Reset the drag offset for the next interaction
    setDragOffset(0);
  };

  const handlers = {
      onMouseDown: (e: React.MouseEvent) => handleDragStart(e.clientX),
      onMouseMove: (e: React.MouseEvent) => handleDragMove(e.clientX),
      onMouseUp: () => handleDragEnd(),
      onMouseLeave: () => handleDragEnd(),
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
      onTouchMove: (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
      onTouchEnd: () => handleDragEnd(),
  }

  return (
    <div className="min-h-screen font-sans bg-black"> {/* Fallback background */}
      <div 
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/d18241a9c8fd06cd20d123ba791c54e4.jpg')" }}
      />

      {/* Contenedor para todo el contenido, con posicionamiento relativo para flotar sobre el fondo */}
      <div className="relative z-10 h-screen">
        {isLoading && <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/80"><Loader /><p className="mt-4 text-lg">Loading Portfolio...</p></div>}
        
        {error && <div className="absolute inset-0 z-50 flex justify-center items-center bg-red-900/80 p-8"><div className="text-center max-w-2xl"><h2 className="text-2xl font-bold mb-4">Error Loading Portfolio</h2><p className="text-red-200 bg-black/20 p-4 rounded-lg font-mono text-left">{error}</p><p className="mt-4 text-sm text-red-300">Please check your Google Sheet and ensure it's published correctly.</p></div></div>}

        {!isLoading && !error && (
          <>
              <header className={`absolute top-0 left-0 p-4 md:p-8 z-30 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                  <div className="flex items-center space-x-4">
                      <img src={nuevoLogo} alt="Logo" className="w-16 md:w-24" />
                      <img src={nombreLogo} alt="Julio H. Morales" className="w-48 md:w-64" />
                  </div>
              </header>

              <div className={`w-full h-full transition-opacity duration-700 ease-out ${selectedProject ? 'opacity-20 pointer-events-none' : 'opacity-100'} ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                  {isDesktop 
                      ? <ProjectGridView projects={projects} onCardClick={handleCardClick} categoryData={categoryData} />
                      : (
                          <div className="w-full h-full">
                              <CarouselView 
                                  projects={projects} 
                                  onCardClick={handleCardClick} 
                                  activeIndex={activeIndex} 
                                  isDragging={isDragging} 
                                  dragOffset={dragOffset} 
                                  handlers={handlers} 
                              />
                          </div>
                      )
                  }
              </div>
            
              {selectedProject && (
                  <ProjectDetailView project={selectedProject} onClose={handleCloseDetail} />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;