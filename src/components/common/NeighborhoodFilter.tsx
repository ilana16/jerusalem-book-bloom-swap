
import { Check } from "lucide-react";
import { useState } from "react";

const NEIGHBORHOODS = [
  "Baka",
  "German Colony",
  "Katamon",
  "Rehavia",
  "City Center",
  "Talpiot",
  "Arnona",
  "French Hill",
  "Ramot",
  "Gilo",
  "Pisgat Ze'ev",
  "Har Nof",
  "Bayit Vegan",
  "Nachlaot",
  "Kiryat Moshe",
  "Old City"
];

interface NeighborhoodFilterProps {
  selectedNeighborhoods: string[];
  onChange: (neighborhoods: string[]) => void;
}

export function NeighborhoodFilter({
  selectedNeighborhoods,
  onChange
}: NeighborhoodFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNeighborhood = (neighborhood: string) => {
    if (selectedNeighborhoods.includes(neighborhood)) {
      onChange(selectedNeighborhoods.filter(n => n !== neighborhood));
    } else {
      onChange([...selectedNeighborhoods, neighborhood]);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm border border-border rounded-md bg-white"
      >
        <span>
          {selectedNeighborhoods.length === 0
            ? "All Neighborhoods"
            : `${selectedNeighborhoods.length} selected`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {NEIGHBORHOODS.map(neighborhood => (
                <div
                  key={neighborhood}
                  className="flex items-center px-2 py-1 rounded-sm hover:bg-muted cursor-pointer"
                  onClick={() => toggleNeighborhood(neighborhood)}
                >
                  <div className="w-4 h-4 mr-2 border border-border rounded-sm flex items-center justify-center">
                    {selectedNeighborhoods.includes(neighborhood) && (
                      <Check className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <span className="text-sm">{neighborhood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
