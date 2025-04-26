
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { jerusalemNeighborhoods } from "@/data/jerusalemNeighborhoods";
import { cn } from "@/lib/utils";

interface NeighborhoodSelectProps {
  value?: string | null;
  onSelect: (value: string) => void;
}

export function NeighborhoodSelect({ value, onSelect }: NeighborhoodSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select neighborhood"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search neighborhood..." 
            className="h-9"
            onValueChange={setSearchValue}
            value={searchValue}
          />
          <CommandEmpty>No neighborhood found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {jerusalemNeighborhoods.map((neighborhood) => (
              <CommandItem
                key={neighborhood}
                value={neighborhood}
                onSelect={() => {
                  onSelect(neighborhood);
                  setOpen(false);
                  setSearchValue("");
                }}
                className="cursor-pointer"
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
