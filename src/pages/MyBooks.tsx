
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

// We'll avoid type recursion by defining our query without complex type inference
export default function MyBooks() {
  const { user } = useAuth();

  // Remove explicit Book[] type annotation that was causing the deep instantiation
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['my-books'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Cast the raw data and map to our Book type without nesting type instantiations
      return (data || []).map((rawBook: any) => ({
        id: rawBook.id,
        title: rawBook.title,
        author: rawBook.author,
        coverColor: rawBook.cover_color,
        description: rawBook.description || "",
        condition: rawBook.condition,
        owner: {
          name: typeof rawBook.owner === 'object' && rawBook.owner && rawBook.owner.name ? 
               rawBook.owner.name : "",
          neighborhood: typeof rawBook.owner === 'object' && rawBook.owner && rawBook.owner.neighborhood ? 
               rawBook.owner.neighborhood : ""
        },
        google_books_id: rawBook.google_books_id || undefined
      } as Book));
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
