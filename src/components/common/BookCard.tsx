
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  description: string;
  condition: string;
  owner: {
    name: string;
    neighborhood: string;
  };
}

interface BookCardProps {
  book: Book;
  onRequestSwap: (bookId: string) => void;
}

export function BookCard({ book, onRequestSwap }: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="book-card" 
      onClick={toggleFlip}
    >
      <div 
        className="book-card-inner" 
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
      >
        <div 
          className="book-spine" 
          style={{ backgroundColor: book.coverColor || '#436B95' }}
        >
          <div className="text-white p-4 text-center">
            <h3 className="font-bold truncate max-w-[180px]">{book.title}</h3>
            <p className="text-sm opacity-80">{book.author}</p>
          </div>
        </div>
        
        <div className="book-details">
          <h3 className="font-bold text-lg mb-1">{book.title}</h3>
          <p className="text-sm font-medium mb-2">{book.author}</p>
          <p className="text-xs text-muted-foreground mb-2">
            Condition: {book.condition}
          </p>
          <p className="text-xs mb-3 flex-grow overflow-y-auto">
            {book.description}
          </p>
          
          <div className="text-xs text-muted-foreground mb-2">
            Available in: {book.owner.neighborhood}
          </div>
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onRequestSwap(book.id);
            }}
          >
            Request Swap
          </Button>
        </div>
      </div>
    </div>
  );
}
