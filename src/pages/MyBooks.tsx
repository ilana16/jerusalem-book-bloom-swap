
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// We'll completely avoid complex type inference to prevent the deep instantiation error
export default function MyBooks() {
  const { user } = useAuth();

  // Using a simple non-generic query to prevent TypeScript from deeply analyzing the return type
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['my-books'],
    queryFn: async () => {
      if (!user) return [] as Book[];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Transform data with explicit typing to avoid TypeScript recursion
      return (data || []).map((rawBook: any): Book => ({
        id: rawBook.id,
        title: rawBook.title,
        author: rawBook.author,
        coverColor: rawBook.cover_color,
        description: rawBook.description || "",
        condition: rawBook.condition,
        owner: {
          name: typeof rawBook.owner === 'object' && rawBook.owner && 'name' in rawBook.owner ? 
               String(rawBook.owner.name) : "",
          neighborhood: typeof rawBook.owner === 'object' && rawBook.owner && 'neighborhood' in rawBook.owner ? 
               String(rawBook.owner.neighborhood) : ""
        },
        google_books_id: rawBook.google_books_id || undefined
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
