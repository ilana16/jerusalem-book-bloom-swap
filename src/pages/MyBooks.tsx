
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// Define specific interfaces to avoid recursive type issues
interface BookOwner {
  name: string;
  neighborhood: string;
}

// Define a simple interface for the raw book data from Supabase
interface RawBookData {
  id: string;
  title: string;
  author: string;
  cover_color: string;
  description: string | null;
  condition: string;
  owner: Record<string, unknown>;  // Use Record instead of any/unknown
  google_books_id: string | null;
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
      
      // Transform raw data to our Book type
      return (data as RawBookData[]).map(book => {
        // Extract owner data safely
        const ownerObj = book.owner || {};
        const ownerName = typeof ownerObj.name === 'string' ? ownerObj.name : "";
        const ownerNeighborhood = typeof ownerObj.neighborhood === 'string' ? ownerObj.neighborhood : "";
        
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
