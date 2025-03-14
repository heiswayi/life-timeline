import React, { useState, useRef, useEffect } from 'react';
import { LifeEvent, TimelineConfig } from '@/types';
import EventTicker from './EventTicker';
import YearMarker from './YearMarker';
import EventDialog from './EventDialog';
import TimelineControls from './TimelineControls';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

interface LifeTimelineProps {
  className?: string;
}

const LifeTimeline: React.FC<LifeTimelineProps> = ({ className }) => {
  // Local state for events (in a real app, this might come from a database)
  const [events, setEvents] = useState<LifeEvent[]>(() => {
    // Try to load from localStorage
    const savedEvents = localStorage.getItem('lifeEvents');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        return parsed.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
      } catch (error) {
        console.error('Failed to parse saved events', error);
      }
    }

    // Default sample events if nothing in localStorage
    const today = new Date();
    const currentYear = today.getFullYear();

    return [
      {
        id: '1',
        title: 'First Bicycle Ride',
        description: 'The thrill of balancing on two wheels for the first time—freedom unlocked!',
        date: new Date(2001, 5, 15),
        significance: 80,
        color: '#FFA500'
      },
      {
        id: '2',
        title: 'First Day of School',
        description: 'Nervous yet excited, stepping into a world of learning and friendship.',
        date: new Date(2003, 8, 1),
        significance: 90,
        color: '#1E90FF'
      },
      {
        id: '3',
        title: 'Winning a Science Fair',
        description: 'A simple project turned into a proud moment—first taste of achievement.',
        date: new Date(2008, 3, 12),
        significance: 85,
        color: '#32CD32'
      },
      {
        id: '4',
        title: 'Teenage First Crush',
        description: 'Butterflies, stolen glances, and a heart learning new emotions.',
        date: new Date(2010, 1, 14),
        significance: 75,
        color: '#FF69B4'
      },
      {
        id: '5',
        title: 'Graduating High School',
        description: 'A milestone filled with tears, joy, and endless possibilities ahead.',
        date: new Date(2013, 5, 20),
        significance: 95,
        color: '#FFD700'
      },
      {
        id: '6',
        title: 'First Job Offer',
        description: 'Hard work paid off—first step into the professional world.',
        date: new Date(2017, 7, 5),
        significance: 98,
        color: '#228B22'
      },
      {
        id: '7',
        title: 'First Solo Travel',
        description: 'Exploring new places, meeting new people, and growing as a person.',
        date: new Date(2019, 4, 10),
        significance: 88,
        color: '#4682B4'
      },
      {
        id: '8',
        title: 'Starting a Passion Project',
        description: 'Turning ideas into reality—something truly meaningful begins.',
        date: new Date(2021, 10, 3),
        significance: 92,
        color: '#8A2BE2'
      },
      {
        id: '9',
        title: 'Career Promotion',
        description: 'Years of dedication recognized—stepping up to new challenges.',
        date: new Date(2023, 6, 18),
        significance: 99,
        color: '#FF4500'
      },
      {
        id: '10',
        title: 'Finding True Love',
        description: 'A heartwarming moment—when everything just felt right.',
        date: new Date(2025, 1, 14),
        significance: 100,
        color: '#DC143C'
      }
    ];
  });

  // Get the range of years from events
  const yearRange = events.reduce(
    (acc, event) => {
      const year = new Date(event.date).getFullYear();
      return {
        earliestYear: Math.min(acc.earliestYear, year),
        latestYear: Math.max(acc.latestYear, year),
      };
    },
    { earliestYear: new Date().getFullYear(), latestYear: new Date().getFullYear() }
  );

  // Load timeline configuration from localStorage or set defaults
  const [config, setConfig] = useState<TimelineConfig>(() => {
    const savedConfig = localStorage.getItem('timelineConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse saved config', error);
      }
    }
    return {
      startYear: yearRange.earliestYear,
      endYear: Math.max(yearRange.latestYear, new Date().getFullYear()),
      yearSpacing: 50,
      showFutureYears: true,
      highlightCurrentYear: true,
    };
  });

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('timelineConfig', JSON.stringify(config));
  }, [config]);

  // Update config if year range changes significantly
  useEffect(() => {
    if (yearRange.earliestYear < config.startYear || yearRange.latestYear > config.endYear) {
      setConfig(prev => ({
        ...prev,
        startYear: Math.min(prev.startYear, yearRange.earliestYear),
        endYear: Math.max(prev.endYear, yearRange.latestYear),
      }));
    }
  }, [yearRange, config.startYear, config.endYear]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<LifeEvent> | null>(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  // Toast notifications
  const { toast } = useToast();

  // Reference to the timeline for scrolling and image export
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem('lifeEvents', JSON.stringify(events));
  }, [events]);

  // Handle adding a new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setDialogOpen(true);
  };

  // Handle editing an existing event
  const handleEditEvent = (event: LifeEvent) => {
    setCurrentEvent(event);
    setDialogOpen(true);
  };

  // Handle saving an event (add or edit)
  const handleSaveEvent = (event: LifeEvent) => {
    const isNew = !events.some(e => e.id === event.id);

    if (isNew) {
      setEvents([...events, event].sort((a, b) => a.date.getTime() - b.date.getTime()));
      toast({
        title: "Event Added",
        description: `"${event.title}" has been added to your timeline.`,
      });
    } else {
      setEvents(events.map(e => e.id === event.id ? event : e)
        .sort((a, b) => a.date.getTime() - b.date.getTime()));
      toast({
        title: "Event Updated",
        description: `"${event.title}" has been updated.`,
      });
    }
  };

  // Handle deleting an event
  const handleRequestDelete = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      const eventTitle = events.find(e => e.id === eventToDelete)?.title;
      setEvents(events.filter(e => e.id !== eventToDelete));
      setDeleteDialogOpen(false);
      setEventToDelete(null);

      toast({
        title: "Event Deleted",
        description: `"${eventTitle}" has been removed from your timeline.`,
        variant: "destructive",
      });
    }
  };

  // Handle timeline configuration changes
  const handleConfigChange = (newConfig: Partial<TimelineConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

  // Generate years array based on configuration
  const years = Array.from(
    { length: config.endYear - config.startYear + 1 },
    (_, i) => config.startYear + i
  );

  // Calculate current year
  const currentYear = new Date().getFullYear();

  // Calculate total timeline width based on year spacing
  const timelineWidth = (years.length * config.yearSpacing) + 100;

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // // Center the timeline to current year on first render
  // useEffect(() => {
  //   if (timelineRef.current && config.highlightCurrentYear) {
  //     const currentYearIndex = years.indexOf(currentYear);
  //     if (currentYearIndex !== -1) {
  //       const scrollPosition = currentYearIndex * config.yearSpacing - window.innerWidth / 2 + config.yearSpacing / 2;
  //       timelineRef.current.scrollLeft = Math.max(0, scrollPosition);
  //     }
  //   }
  // }, [config.highlightCurrentYear, config.yearSpacing, currentYear, years]);

  // Add state for hover highlighting
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Handle exporting timeline as image
  const handleExportImage = async () => {
    if (!timelineContainerRef.current) return;

    try {
      // Show toast to indicate export is in progress
      toast({
        title: "Preparing image...",
        description: "Please wait while we generate your timeline image.",
      });

      // Use html2canvas to capture the timeline
      const canvas = await html2canvas(timelineContainerRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        allowTaint: true,
        useCORS: true,
      });

      // Create a new canvas to overlay the watermark
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;

      const ctx = finalCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      // Draw the captured image onto the new canvas
      ctx.drawImage(canvas, 0, 0);

      // Add watermark text at the bottom right corner
      const watermarkText = "Made by Life Timeline";
      ctx.font = "20px sans-serif"; // Adjust font size
      ctx.fillStyle = "#1e293b"; // Semi-transparent white
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"; // Outline for better visibility
      ctx.lineWidth = 3;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";

      // Positioning the watermark
      const padding = 30; // Distance from edges
      const x = finalCanvas.width - padding;
      const y = finalCanvas.height - padding;

      // Draw stroke first (outline effect) and then fill
      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);

      // Convert final canvas to data URL
      const imageUrl = finalCanvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.download = `life-timeline-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = imageUrl;
      link.click();

      toast({
        title: "Export successful!",
        description: "Your timeline has been saved as a PNG image.",
      });
    } catch (error) {
      console.error("Error exporting timeline:", error);
      toast({
        title: "Export failed",
        description: "There was an error creating your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!timelineRef.current) return;

    const startX = event.clientX;
    const startScrollLeft = timelineRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      timelineRef.current!.scrollLeft = startScrollLeft - deltaX;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleClearAllData = () => {
    setEvents([]);
    setConfig({
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      yearSpacing: 50,
      showFutureYears: true,
      highlightCurrentYear: true,
    });

    localStorage.removeItem('lifeEvents');
    localStorage.removeItem('timelineConfig');

    setClearAllDialogOpen(false);

    toast({
      title: "All Data Cleared",
      description: "Your timeline has been reset.",
      variant: "destructive",
    });
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <TimelineControls
        config={config}
        onConfigChange={handleConfigChange}
        onAddEvent={handleAddEvent}
        onExportImage={handleExportImage}
        onReset={() => setClearAllDialogOpen(true)}
        yearRange={yearRange}
      />

      <div
        ref={timelineRef}
        className="overflow-x-auto overscroll-x-contain timeline-scrollbar bg-gradient-to-b from-background/40 to-background"
        style={{ touchAction: 'pan-x' }}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={timelineContainerRef}
          className="relative bg-[#010614] border"
          style={{
            width: `${timelineWidth}px`,
            minWidth: '100%',
            height: '300px',
          }}
        >
          {/* Main timeline line - positioned exactly in the middle */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-timeline-line transform -translate-y-1/2" />

          {/* Year markers - properly aligned to vertical center */}
          {years.map((year, index) => (
            <div
              key={year}
              className="absolute top-1/2 transform -translate-y-1/4 transition-opacity duration-500"
              style={{
                left: `${index * config.yearSpacing + 20}px`,
                opacity: (!config.showFutureYears && year > currentYear) ? 0.3 : 1
              }}
            >
              <YearMarker
                year={year}
                isCurrent={config.highlightCurrentYear && year === currentYear}
              />
            </div>
          ))}

          {/* Event tickers - properly aligned to vertical center */}
          {sortedEvents.map((event) => {
            const eventYear = new Date(event.date).getFullYear();
            const eventMonth = new Date(event.date).getMonth();
            const yearSpacing = config.yearSpacing + 1;
            const tickerPosition = eventMonth / 12 * yearSpacing;
            const monthOffset = 32 + tickerPosition;

            // Skip if the event year is outside our range
            if (eventYear < config.startYear || eventYear > config.endYear) {
              return null;
            }

            const yearIndex = years.indexOf(eventYear);
            const isHovered = hoveredEventId === event.id;

            return (
              <div
                key={event.id}
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{
                  left: `${(yearIndex * config.yearSpacing) + monthOffset}px`
                }}
              >
                <EventTicker
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleRequestDelete}
                  isHighlighted={isHovered}
                  onHoverStart={() => setHoveredEventId(event.id)}
                  onHoverEnd={() => setHoveredEventId(null)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <span className='text-sm opacity-50 italic'><strong>Tip:</strong> Right-click on the event line to edit or delete it.</span>

      {/* Event descriptions section - reduced top margin */}
      <div className="mt-8 pb-8">
        <h3 className="text-lg font-medium mb-3 text-foreground">Life Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEvents.map(event => (
            <div
              key={event.id}
              className={cn(
                "bg-card p-4 rounded-lg border border-border/50 transition-all duration-300",
                hoveredEventId === event.id && "ring-2 ring-primary"
              )}
              onMouseEnter={() => setHoveredEventId(event.id)}
              onMouseLeave={() => setHoveredEventId(null)}
            >
              <div
                className="h-1 w-full mb-3 rounded-full"
                style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
              />
              <h4 className="font-medium text-sm">{event.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(event.date), 'MMMM d, yyyy')}
              </p>
              {event.description && (
                <p className="text-xs mt-2 text-foreground/80">{event.description}</p>
              )}
              <p className="text-xs mt-2 text-muted-foreground">
                Significance: {event.significance}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={currentEvent}
        onSave={handleSaveEvent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this life event from your timeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all events and reset your timeline settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
};

export default LifeTimeline;
