
import { useState, useEffect } from "react";
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

interface NeighborhoodSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function NeighborhoodSelect({ value, onChange }: NeighborhoodSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Ensure jerusalemNeighborhoods is always an array with fallback
  const neighborhoods = Array.isArray(jerusalemNeighborhoods) ? jerusalemNeighborhoods : [];
  
  // Filter neighborhoods based on search
  const filteredNeighborhoods = neighborhoods.filter((neighborhood) =>
    neighborhood.toLowerCase().includes(search.toLowerCase())
  );

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
          <CommandInput 
            placeholder="Search neighborhood..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No neighborhood found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredNeighborhoods.map((neighborhood) => (
              <CommandItem
                key={neighborhood}
                value={neighborhood}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                  setSearch("");
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
