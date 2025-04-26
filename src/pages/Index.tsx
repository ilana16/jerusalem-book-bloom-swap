
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, ArrowRight } from "lucide-react";
import { BookList } from "@/components/common/BookList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book as BookType } from "@/components/common/BookCard";

const Index = () => {
  const { data: featuredBooks = [], isLoading, error } = useQuery<BookType[]>({
    queryKey: ['featuredBooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        throw error;
      }
      
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
    return <div>Loading featured books...</div>;
  }

  if (error) {
    return <div>Error loading featured books</div>;
  }

  return (
    <Layout>
      <div className="bg-bookswap-blue py-16 md:py-24">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Share the Joy of Reading in Jerusalem
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Connect with fellow book lovers and swap English books locally. 
              No money, no points—just a community sharing stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90">
                <Link to="/books">Browse Available Books</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/add">Share Your Books</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Recently Added Books</h2>
          <Link to="/books" className="flex items-center text-bookswap-darkblue hover:underline">
            <span>View all</span>
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <BookList books={featuredBooks} />
      </div>

      <div className="bg-white py-12 md:py-16 border-y border-border">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-bookswap-blue flex items-center justify-center mb-4">
                <Book className="w-8 h-8 text-bookswap-darkblue" />
              </div>
              <h3 className="text-xl font-bold mb-2">List Your Books</h3>
              <p className="text-muted-foreground">
                Share the books you've enjoyed and are ready to pass on to another reader in Jerusalem.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-bookswap-blue flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-bookswap-darkblue"
                >
                  <path d="M16 3h5v5" />
                  <path d="M8 3H3v5" />
                  <path d="M21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
                  <path d="m21 8-5-5-5 5" />
                  <path d="m3 16 5 5 5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Find Matches</h3>
              <p className="text-muted-foreground">
                Our system matches you with local readers who have books you want or want books you have.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-bookswap-blue flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-bookswap-darkblue"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Meet & Swap</h3>
              <p className="text-muted-foreground">
                Arrange to meet at a convenient location in your neighborhood and exchange books.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-12 md:py-16">
        <div className="bg-bookswap-stone/20 border border-bookswap-stone/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Help us maximize the circulation of English books throughout Jerusalem. 
            Every book deserves new readers, and every reader deserves new books.
          </p>
          <Button asChild size="lg" className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90">
            <Link to="/books">Start Swapping Now</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
