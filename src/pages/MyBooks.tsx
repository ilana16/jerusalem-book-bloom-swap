
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

export default function MyBooks() {
  const { user } = useAuth();

  // Explicitly type the query result and use a more direct approach
  const { data: books, isLoading, error } = useQuery<Book[]>({
    queryKey: ['my-books'],
    queryFn: async () => {
      if (!user) return [] as Book[];
      
      // Use a simpler approach to fetch data
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Transform the data more explicitly
      const result: Book[] = [];
      
      if (data) {
        for (const item of data) {
          // Use type assertions and explicit conversions to avoid deep type inference
          const book: Book = {
            id: String(item.id || ''),
            title: String(item.title || ''),
            author: String(item.author || ''),
            coverColor: String(item.cover_color || '#436B95'),
            description: item.description ? String(item.description) : "",
            condition: String(item.condition || 'Good'),
            owner: {
              // Use the helper function to safely extract strings
              name: getOwnerProperty(item.owner, 'name'),
              neighborhood: getOwnerProperty(item.owner, 'neighborhood')
            },
            google_books_id: item.google_books_id ? String(item.google_books_id) : undefined
          };
          
          result.push(book);
        }
      }
      
      return result;
    },
    enabled: !!user
  });

  // Helper function with more explicit typing to safely extract owner properties
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
