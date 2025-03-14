
import React from 'react';
import { cn } from '@/lib/utils';
import { LifeEvent } from '@/types';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Pencil, Trash2 } from 'lucide-react';

interface EventTickerProps {
  event: LifeEvent;
  onEdit: (event: LifeEvent) => void;
  onDelete: (eventId: string) => void;
  isHighlighted?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  className?: string;
}

const EventTicker: React.FC<EventTickerProps> = ({ 
  event, 
  onEdit,
  onDelete,
  isHighlighted,
  onHoverStart,
  onHoverEnd,
  className 
}) => {
  // Calculate height based on significance (1-100)
  const height = Math.max(30, Math.min(150, 30 + event.significance));
  
  return (
    <div 
      className={cn(
        "group flex flex-col items-center animate-fade-in",
        isHighlighted && "z-10",
        className
      )}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex flex-col items-center cursor-pointer">
            <div 
              className={cn(
                "ticker-line w-1 z-0", 
                isHighlighted && "opacity-100",
                !isHighlighted && "opacity-80"
              )}
              style={{ 
                height: `${height}px`, 
                backgroundColor: event.color || 'hsl(var(--primary))' 
              }}
            />
            {/* Title displayed diagonally at the bottom, position improved */}
            <span 
              className={cn(
                "text-xs max-w-[100px] origin-top-left",
                isHighlighted ? "" : ""
              )}
              style={{ 
                transform: 'rotate(-45deg)',
                transformOrigin: 'left top',
                display: 'block',
                position: 'absolute',
                top: '-10px',
                left: '-5px',
                color: event.color || 'hsl(var(--foreground))',
                fontSize: '10px',
                lineHeight: '1.1',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                width: '100px',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }}
            >
              {event.title}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem 
            onClick={() => onEdit(event)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="h-4 w-4" /> Edit Event
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => onDelete(event.id)}
            className="flex items-center gap-2 cursor-pointer text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Delete Event
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default EventTicker;
