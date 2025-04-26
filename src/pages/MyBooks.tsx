
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

export default function MyBooks() {
  const { user } = useAuth();

  // Using explicit typing and avoiding complex inference
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['my-books'],
    queryFn: async (): Promise<Book[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Transform raw data to Book objects with simpler approach
      const result: Book[] = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const book = data[i];
          result.push({
            id: String(book.id),
            title: String(book.title),
            author: String(book.author),
            coverColor: String(book.cover_color),
            description: book.description ? String(book.description) : "",
            condition: String(book.condition),
            owner: {
              name: book.owner && typeof book.owner === 'object' ? String(book.owner.name || "") : "",
              neighborhood: book.owner && typeof book.owner === 'object' ? String(book.owner.neighborhood || "") : "",
            },
            google_books_id: book.google_books_id ? String(book.google_books_id) : undefined
          });
        }
      }
      
      return result;
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
          <MyBooksList books={books || []} />
        )}
      </div>
    </Layout>
  );
}
