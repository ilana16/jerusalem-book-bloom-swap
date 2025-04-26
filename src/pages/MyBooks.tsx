
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

interface OwnerData {
  name?: string;
  neighborhood?: string;
}

export default function MyBooks() {
  const { user } = useAuth();

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['my-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user?.id);
      
      if (error) throw error;
      
      return data.map(book => {
        // Extract owner data safely without deep type recursion
        let ownerName = "";
        let ownerNeighborhood = "";
        
        if (typeof book.owner === 'object' && book.owner !== null) {
          const ownerObj = book.owner as Record<string, unknown>;
          if (typeof ownerObj.name === 'string') {
            ownerName = ownerObj.name;
          }
          if (typeof ownerObj.neighborhood === 'string') {
            ownerNeighborhood = ownerObj.neighborhood;
          }
        }
        
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          coverColor: book.cover_color,
          description: book.description || "",
          condition: book.condition,
          owner: {
            name: ownerName,
            neighborhood: ownerNeighborhood
          },
          google_books_id: book.google_books_id
        };
      });
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <Layout>
        <div className="page-container">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Please sign in to manage your books</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-8">My Books</h1>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading your books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">Error loading your books</p>
          </div>
        ) : (
          <MyBooksList books={books} />
        )}
      </div>
    </Layout>
  );
}
