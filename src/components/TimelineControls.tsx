
import React from 'react';
import { TimelineConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Settings, Download, RefreshCcw } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimelineControlsProps {
  config: TimelineConfig;
  onConfigChange: (config: Partial<TimelineConfig>) => void;
  onAddEvent: () => void;
  onExportImage: () => void;
  onReset: () => void;
  yearRange: { earliestYear: number; latestYear: number };
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  config,
  onConfigChange,
  onAddEvent,
  onExportImage,
  onReset,
  yearRange,
}) => {
  return (
    <div className="flex items-center justify-between py-4 bg-opacity-70 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddEvent}
                className="transition-all duration-300 shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Life Event
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Add a new life event
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onExportImage}
                variant="outline"
                className="transition-all duration-300 shadow-sm"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" /> Export as Image
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Save timeline as PNG image
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onReset}
                variant="destructive"
                className="transition-all duration-300 shadow-sm"
                size='sm'
              >
                <RefreshCcw className="h-4 w-4" /> Clear All Data
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Clear all data and reset settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="transition-all duration-300"
                    size='sm'
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Timeline settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Timeline Settings</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startYear" className="text-xs">Start Year</Label>
                  <Input
                    id="startYear"
                    type="number"
                    value={config.startYear}
                    min={yearRange.earliestYear - 10}
                    onChange={(e) =>
                      onConfigChange({ startYear: parseInt(e.target.value) || yearRange.earliestYear })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endYear" className="text-xs">End Year</Label>
                  <Input
                    id="endYear"
                    type="number"
                    value={config.endYear}
                    min={yearRange.earliestYear}
                    onChange={(e) =>
                      onConfigChange({ endYear: parseInt(e.target.value) || yearRange.latestYear })
                    }
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearSpacing" className="text-xs">Year Spacing (px)</Label>
                <Input
                  id="yearSpacing"
                  type="number"
                  value={config.yearSpacing}
                  min={50}
                  max={200}
                  onChange={(e) =>
                    onConfigChange({ yearSpacing: parseInt(e.target.value) || 100 })
                  }
                  className="h-8"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showFutureYears" className="text-xs cursor-pointer">
                  Show Future Years
                </Label>
                <Switch
                  id="showFutureYears"
                  checked={config.showFutureYears}
                  onCheckedChange={(checked) =>
                    onConfigChange({ showFutureYears: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="highlightCurrentYear" className="text-xs cursor-pointer">
                  Highlight Current Year
                </Label>
                <Switch
                  id="highlightCurrentYear"
                  checked={config.highlightCurrentYear}
                  onCheckedChange={(checked) =>
                    onConfigChange({ highlightCurrentYear: checked })
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};

export default TimelineControls;
