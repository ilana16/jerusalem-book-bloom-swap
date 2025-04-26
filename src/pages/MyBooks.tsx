
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";
import { MyBooksList } from "@/components/common/MyBooksList";

export default function MyBooks() {
  const { user } = useAuth();

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['my-books'],
    queryFn: async () => {
      if (!user) return [] as Book[];
      
      // Fetch books from Supabase
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', user.id);
      
      if (error) throw error;
      
      // Transform raw data to Book objects
      const result: Book[] = [];
      
      if (data) {
        for (const book of data) {
          // Extract owner data safely
          let ownerName = '';
          let ownerNeighborhood = '';
          
          if (book.owner && typeof book.owner === 'object') {
            // Type assertion to make TypeScript happy
            const ownerObj = book.owner as Record<string, any>;
            ownerName = typeof ownerObj.name === 'string' ? ownerObj.name : '';
            ownerNeighborhood = typeof ownerObj.neighborhood === 'string' ? ownerObj.neighborhood : '';
          }
          
          result.push({
            id: String(book.id || ''),
            title: String(book.title || ''),
            author: String(book.author || ''),
            coverColor: String(book.cover_color || '#436B95'),
            description: book.description ? String(book.description) : "",
            condition: String(book.condition || 'Good'),
            owner: {
              name: ownerName,
              neighborhood: ownerNeighborhood,
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
