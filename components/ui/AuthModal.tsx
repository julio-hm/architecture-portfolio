import React from 'react';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="relative bg-gray-900/70 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-bold text-white mb-6">Autenticación Requerida</h2>
        <button
          onClick={onClose}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
