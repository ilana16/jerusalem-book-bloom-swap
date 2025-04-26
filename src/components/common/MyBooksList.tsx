
import { useState } from "react";
import { Book } from "./BookCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MyBooksListProps {
  books: Book[];
}

export function MyBooksList({ books }: MyBooksListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (bookId: string) => {
    setIsDeleting(bookId);
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      toast.success("Book removed successfully");
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("Failed to remove book");
    } finally {
      setIsDeleting(null);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">You haven't added any books yet</p>
        <Button variant="default" onClick={() => window.location.href = '/add'}>
          Add Your First Book
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="relative">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={() => handleDelete(book.id)}
            disabled={isDeleting === book.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <CardContent className="pt-4">
            {book.google_books_id ? (
              <div 
                className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                style={{ 
                  backgroundImage: `url(https://books.google.com/books/content?id=${book.google_books_id}&printsec=frontcover&img=1&zoom=1&source=gbs_api)`
                }}
              />
            ) : (
              <div 
                className="w-full h-48 p-4 flex flex-col justify-center items-center text-center rounded-lg mb-4"
                style={{ backgroundColor: book.coverColor }}
              >
                <h3 className="font-bold text-white">{book.title}</h3>
                <p className="text-sm text-white/80">{book.author}</p>
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-1">{book.title}</h3>
            <p className="text-sm font-medium mb-2">{book.author}</p>
            <p className="text-xs text-muted-foreground">
              Condition: {book.condition}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
