import React, { useState } from 'react';
import type { Project } from '../types';
import GlassCard from './ui/GlassCard';
import GeminiChat from './GeminiChat';
import Lightbox from './ui/Lightbox';
import AuthModal from './ui/AuthModal'; // Importar el nuevo modal

// --- Iconos ---
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
const BathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m-6-13.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm4.5-13.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm4.5-13.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008z" /></svg>;
const AreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v2.25A2.25 2.25 0 006 20.25z" /></svg>;
const ParkingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>;
const OctahedronIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12l10 10 10-10L12 2zM2 12h20M12 2v20" /></svg>;
const XIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Componente de Métrica Reutilizable ---
const MetricItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number | undefined; }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
            <div className="text-indigo-300 flex-shrink-0">{icon}</div>
            <div>
                <p className="text-slate-300 text-sm font-light whitespace-nowrap">{label}</p>
                <p className="text-white font-semibold text-base">{value}</p>
            </div>
        </div>
    );
};

// --- Vista de Detalle Principal ---
const ProjectDetailView: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const [mainImage, setMainImage] = useState(project.mainImage);
  const [isChatOpen, setIsChatOpen] = useState(false); // Mantener por si se usa en el futuro
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Estado para el nuevo modal
  const gallery = [project.mainImage, ...project.galleryImages].filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 z-50 animate-fade-in font-sans flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 backdrop-blur-md"></div>
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-[60] w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <GlassCard 
          className="w-full max-w-5xl h-[90vh] max-h-[700px] flex justify-end overflow-hidden bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${mainImage})` }}
        >
          {/* Contenedor de Contenido Translúcido */}
          <div className="w-full lg:w-1/2 h-full bg-black/50 backdrop-blur-xl border-l border-white/10 p-6 lg:p-8 flex flex-col">
              <header className="mb-4 flex-shrink-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">{project.projectName}</h1>
                  <p className="text-base lg:text-md text-slate-300">{project.location}</p>
              </header>

              {/* Galería de Imágenes */}
              {gallery.length > 1 && (
                  <div className="flex-shrink-0 mb-6">
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                          {gallery.slice(0, 5).map((img, index) => (
                              <img 
                                  key={index}
                                  src={img} 
                                  alt={`Thumbnail ${index}`}
                                  onClick={() => setLightboxImage(img)} // Abre el lightbox
                                  className={`h-16 w-24 rounded-md object-cover cursor-pointer transition-all duration-300 hover:opacity-100 flex-shrink-0 ${mainImage === img ? 'ring-2 ring-indigo-400 opacity-100' : 'opacity-60'}`}
                              />
                          ))}
                      </div>
                  </div>
              )}

              <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                  <div>
                      <h2 className="text-lg font-semibold text-white mb-2">Sobre este Proyecto</h2>
                      <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
                          {project.longDescription || 'Descripción detallada no disponible. ¡Pronto más información!'}
                      </p>
                  </div>
                  <div>
                      <h2 className="text-lg font-semibold text-white mb-2">Detalles</h2>
                      <div className="grid grid-cols-2 gap-4">
                          <MetricItem icon={<AreaIcon />} label="Área" value={project.area ? `${project.area} m²` : undefined} />
                          <MetricItem icon={<BedIcon />} label="Recamaras" value={project.recamaras} />
                          <MetricItem icon={<BathIcon />} label="Baños" value={project.banos} />
                          <MetricItem icon={<ParkingIcon />} label="Parking" value={project.estacionamiento} />
                      </div>
                  </div>
              </div>
              <div className="mt-auto flex-shrink-0 pt-4">
                  <button 
                      onClick={() => setIsAuthModalOpen(true)} // Abre el modal personalizado
                      className="w-full flex items-center justify-center p-3 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-500/50 rounded-lg text-white font-bold transition-all duration-300 backdrop-blur-sm"
                  >
                      <OctahedronIcon className="w-6 h-6 mr-2" />
                      Chatea con DA
                  </button>
              </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Renderizar el Lightbox si hay una imagen seleccionada */}
      {lightboxImage && (
        <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}

      {/* Renderizar el modal de autenticación */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};

export default ProjectDetailView;
