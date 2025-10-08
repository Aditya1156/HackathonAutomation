import React from 'react';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`relative p-[2px] rounded-xl glowing-card ${className}`} style={style}>
      <div className="glowing-card-content p-8">
        {children}
      </div>
    </div>
  );
};

export default GlowingCard;