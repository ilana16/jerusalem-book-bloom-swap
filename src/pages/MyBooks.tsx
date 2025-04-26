
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

export default function MyBooks() {
  const { user } = useAuth();

  // Use explicit typing and avoid complex type inference
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['my-books'],
    // Explicitly define the return type of the queryFn
    queryFn: async () => {
      if (!user) return [] as Book[];
      
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Process the data with explicit typing
      return processBooks(data || []);
    },
    enabled: !!user
  });

  // Move the processing logic to a separate function to reduce complexity in the queryFn
  function processBooks(data: any[]): Book[] {
    const result: Book[] = [];
    
    for (const item of data) {
      const book: Book = {
        id: String(item.id || ''),
        title: String(item.title || ''),
        author: String(item.author || ''),
        coverColor: String(item.cover_color || '#436B95'),
        description: item.description ? String(item.description) : "",
        condition: String(item.condition || 'Good'),
        owner: {
          name: getOwnerProperty(item.owner, 'name'),
          neighborhood: getOwnerProperty(item.owner, 'neighborhood')
        },
        google_books_id: item.google_books_id ? String(item.google_books_id) : undefined
      };
      
      result.push(book);
    }
    
    return result;
  }

  // Helper function with explicit typing to safely extract owner properties
  function getOwnerProperty(owner: unknown, key: string): string {
    if (owner && typeof owner === 'object' && owner !== null) {
      const ownerObj = owner as Record<string, unknown>;
      const value = ownerObj[key];
      return typeof value === 'string' ? value : '';
    }
    return '';
  }

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
          <MyBooksList books={books || []} />
        )}
      </div>
    </Layout>
  );
}
