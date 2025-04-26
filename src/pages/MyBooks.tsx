
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// Define the owner structure with simple types to avoid recursion
interface BookOwner {
  id?: string;
  name?: string;
  neighborhood?: string;
}

// Define simplified interface for raw book data from database
interface RawBookData {
  id: string;
  title: string;
  author: string;
  cover_color: string;
  description: string | null;
  condition: string;
  owner: Record<string, any>; // Use Record type to avoid deep type instantiation
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
        // Cast to any first to avoid TypeScript recursion issues
        const rawData = rawBook as any;
        
        // Explicitly construct the Book object with proper types
        return {
          id: rawData.id,
          title: rawData.title,
          author: rawData.author,
          coverColor: rawData.cover_color,
          description: rawData.description || "",
          condition: rawData.condition,
          owner: {
            name: rawData.owner?.name || "",
            neighborhood: rawData.owner?.neighborhood || ""
          },
          google_books_id: rawData.google_books_id || undefined
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
