
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// Define an interface for the raw database response to avoid type recursion
interface BookDbRecord {
  id: string;
  title: string;
  author: string;
  cover_color: string;
  description: string | null;
  condition: string;
  owner: {
    id?: string;
    name?: string;
    neighborhood?: string;
  };
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
      
      // Explicitly cast data to break type recursion
      const bookRecords = data as unknown as BookDbRecord[];
      
      // Map to our Book type structure with explicit typing
      return bookRecords.map((book): Book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverColor: book.cover_color,
        description: book.description || "",
        condition: book.condition,
        owner: {
          name: book.owner?.name || "",
          neighborhood: book.owner?.neighborhood || ""
        },
        google_books_id: book.google_books_id || undefined
      }));
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
