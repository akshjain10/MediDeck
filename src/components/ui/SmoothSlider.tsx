import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const SmoothSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, onValueChange, ...props }, ref) => {
  // Local state for smooth dragging
  const [localValue, setLocalValue] = React.useState(value);
  const [isDragging, setIsDragging] = React.useState(false);

  // Sync with external value when not dragging
  React.useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={localValue}
      onValueChange={(val) => {
        setLocalValue(val);
        if (!isDragging) {
          onValueChange?.(val);
        }
      }}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => {
        setIsDragging(false);
        onValueChange?.(localValue);
      }}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary transition-colors duration-100" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});

SmoothSlider.displayName = SliderPrimitive.Root.displayName;

export { SmoothSlider };