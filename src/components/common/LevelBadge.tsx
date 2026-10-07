import React from 'react';
import { LEVEL_METADATA } from '../../services/ratingService';
import { NUBPCLevel } from '../../types';

interface LevelBadgeProps {
  level: NUBPCLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
}) => {
  const meta = LEVEL_METADATA[level] || LEVEL_METADATA.Newbie;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${meta.bgColor} ${meta.textColor} ${meta.borderColor} ${sizeClasses[size]} transition-colors`}
      title={`${meta.name}: ${meta.description}`}
    >
      {showDot && (
        <span
          className={`rounded-full ${dotSizes[size]}`}
          style={{ backgroundColor: meta.hex }}
        />
      )}
      {level}
    </span>
  );
};
