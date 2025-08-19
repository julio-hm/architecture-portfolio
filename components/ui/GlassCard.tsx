import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
