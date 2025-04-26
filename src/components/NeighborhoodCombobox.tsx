
import * as React from "react";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { jerusalemNeighborhoods } from "@/data/jerusalemNeighborhoods";

interface NeighborhoodComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function NeighborhoodCombobox({ value, onChange }: NeighborhoodComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select neighborhood..."}
          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search neighborhood..." />
          <CommandEmpty>No neighborhood found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {jerusalemNeighborhoods.map((neighborhood) => (
              <CommandItem
                key={neighborhood}
                onSelect={() => {
                  onChange(neighborhood);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === neighborhood ? "opacity-100" : "opacity-0"
                  )}
                />
                {neighborhood}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
