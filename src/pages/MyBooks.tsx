
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// Define simple owner structure to avoid recursion
interface BookOwner {
  id?: string;
  name?: string;
  neighborhood?: string;
}

// Define interface for raw book data from database
interface BookDbRecord {
  id: string;
  title: string;
  author: string;
  cover_color: string;
  description: string | null;
  condition: string;
  owner: BookOwner | null;
  google_books_id: string | null;
}

export default function MyBooks() {
  const { user } = useAuth();

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['my-books'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Transform raw data to Book type using explicit mapping
      return (data || []).map((rawBook) => {
        // First cast to our intermediate type to handle the database structure
        const bookRecord = rawBook as unknown as BookDbRecord;
        
        // Then map to the Book interface expected by the components
        return {
          id: bookRecord.id,
          title: bookRecord.title,
          author: bookRecord.author,
          coverColor: bookRecord.cover_color,
          description: bookRecord.description || "",
          condition: bookRecord.condition,
          owner: {
            name: bookRecord.owner?.name || "",
            neighborhood: bookRecord.owner?.neighborhood || ""
          },
          google_books_id: bookRecord.google_books_id || undefined
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
