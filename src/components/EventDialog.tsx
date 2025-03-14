
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { LifeEvent } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Date is required',
  }),
  significance: z.number().min(1).max(100),
  color: z.string().optional(),
});

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Partial<LifeEvent> | null;
  onSave: (event: LifeEvent) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({ 
  open, 
  onOpenChange, 
  event, 
  onSave 
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      date: new Date(),
      significance: 50,
      color: '#0284c7',
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        id: event.id || '',
        title: event.title || '',
        description: event.description || '',
        date: event.date || new Date(),
        significance: event.significance || 50,
        color: event.color || '#0284c7',
      });
    } else {
      form.reset({
        id: '',
        title: '',
        description: '',
        date: new Date(),
        significance: 50,
        color: '#0284c7',
      });
    }
  }, [event, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onSave({
      id: data.id || crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      date: data.date,
      significance: data.significance,
      color: data.color,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="h-1.5 w-full" style={{ backgroundColor: form.watch('color') }} />
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-medium">
            {event?.id ? 'Edit Life Event' : 'Add Life Event'}
          </DialogTitle>
          <DialogDescription>
            Capture your significant life moments to visualize on your timeline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Graduation, New Job, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-9 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="significance"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Significance ({value}%)</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      defaultValue={[value]}
                      onValueChange={(vals) => onChange(vals[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>
                    How significant is this event in your life?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add details about this life event..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
