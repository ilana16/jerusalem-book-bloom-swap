
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { BookList } from "@/components/common/BookList";
import { NeighborhoodFilter } from "@/components/common/NeighborhoodFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/components/common/BookCard";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['books', searchTerm, selectedNeighborhoods],
    queryFn: async () => {
      let query = supabase.from('books').select('*');
      
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }
      
      if (selectedNeighborhoods.length > 0) {
        query = query.filter('owner->neighborhood', 'in', `(${selectedNeighborhoods.join(',')})`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverColor: book.cover_color,
        description: book.description || "",
        condition: book.condition,
        owner: book.owner as { name: string; neighborhood: string }
      }));
    }
  });

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error loading books</div>;
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Browse Available Books</h1>
          <Button asChild className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90">
            <Link to="/add">Add Your Book</Link>
          </Button>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="col-span-1">
              <NeighborhoodFilter
                selectedNeighborhoods={selectedNeighborhoods}
                onChange={setSelectedNeighborhoods}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {books.length} of {books.length} books
          </p>
        </div>

        <BookList 
          books={books} 
          emptyMessage="No books match your search criteria. Try adjusting your filters or add your own books to share!"
        />
      </div>
    </Layout>
  );
};

export default Books;
