
import { jerusalemNeighborhoods } from "@/data/jerusalemNeighborhoods";

export function NeighborhoodSelect({ value, onSelect }: NeighborhoodSelectProps) {
  return (
    <Select value={value || ""} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select neighborhood" />
      </SelectTrigger>
      <SelectContent>
        {jerusalemNeighborhoods.map((neighborhood) => (
          <SelectItem key={neighborhood} value={neighborhood}>
            {neighborhood}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

