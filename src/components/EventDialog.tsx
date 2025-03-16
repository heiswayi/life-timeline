import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { LifeEvent } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CascadingDateSelector from "./CascadingDateSelector";
import ColorSelect from "./ColorSelect";

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
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
  onSave,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      date: new Date(),
      significance: 50,
      color: "#0284c7",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        id: event.id || "",
        title: event.title || "",
        description: event.description || "",
        date: event.date || new Date(),
        significance: event.significance || 50,
        color: event.color || "#0284c7",
      });
    } else {
      form.reset({
        id: "",
        title: "",
        description: "",
        date: new Date(),
        significance: 50,
        color: "#0284c7",
      });
    }
  }, [event, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onSave({
      id: data.id || crypto.randomUUID(),
      title: data.title,
      description: data.description || "",
      date: data.date,
      significance: data.significance,
      color: data.color,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: form.watch("color") }}
        />
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-medium">
            {event?.id ? "Edit Life Event" : "Add Life Event"}
          </DialogTitle>
          <DialogDescription>
            Capture your significant life moments to visualize on your timeline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event title</FormLabel>
                  <FormControl>
                    <Input placeholder="Graduation, New Job, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event date</FormLabel>
                  <CascadingDateSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {/* Color Picker Input */}
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />

                      {/* ColorSelect Dropdown */}
                      <ColorSelect
                        onSelect={(selected) => field.onChange(selected.value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="significance"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>
                    How significant is this event in your life? ({value}%)
                  </FormLabel>
                  <div className="flex items-center space-x-2">
                    <span>0</span>
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
                    <span>100</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event description (Optional)</FormLabel>
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
