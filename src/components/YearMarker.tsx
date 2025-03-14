
import React from 'react';
import { cn } from '@/lib/utils';

interface YearMarkerProps {
  year: number;
  isCurrent?: boolean;
  className?: string;
}

const YearMarker: React.FC<YearMarkerProps> = ({ 
  year, 
  isCurrent = false,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "h-3 w-px bg-timeline-marker transition-all duration-300",
          isCurrent && "h-5 bg-primary animate-pulse-subtle"
        )}
      />
      <span 
        className={cn(
          "text-xs text-muted-foreground mt-1 font-medium transition-all duration-300",
          isCurrent && "text-primary"
        )}
      >
        {year}
      </span>
    </div>
  );
};

export default YearMarker;
