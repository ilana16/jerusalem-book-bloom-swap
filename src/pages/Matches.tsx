
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { BookCard, Book } from "@/components/common/BookCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface MatchGroup {
  user: {
    id: string;
    name: string;
    neighborhood: string;
    booksOffered: Book[];
    booksWanted: Book[];
  };
  matchScore: number;
}

const Matches = () => {
  const { data: matches = [], isLoading, error } = useQuery<MatchGroup[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      // This is a placeholder. In a real implementation, you'd create a function 
      // in Supabase or your backend to generate these matches
      const { data: currentUserBooks, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('owner->id', supabase.auth.getUser()?.id);

      if (booksError) {
        throw booksError;
      }

      // Placeholder match generation logic
      const { data: potentialMatches, error: matchError } = await supabase
        .from('books')
        .select('*')
        .neq('owner->id', supabase.auth.getUser()?.id);

      if (matchError) {
        throw matchError;
      }

      // Implement match generation logic here
      return []; // Return actual matches
    }
  });

  const handleRequestSwap = (bookId: string) => {
    toast({
      title: "Swap requested",
      description: "We'll notify you when the owner responds.",
    });
  };

  const handleStartChat = (userId: string) => {
    toast({
      title: "Chat started",
      description: "You can now coordinate the book swap.",
    });
  };

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  if (error) {
    return <div>Error loading matches</div>;
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading">Your Book Swap Matches</h1>

        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          These are potential swap partners based on the books you've listed and the books you're looking for. 
          Higher match scores indicate more opportunities to swap multiple books with the same person.
        </p>

        {matches.length === 0 ? (
          <div className="bg-white border border-border rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-3">No Matches Found Yet</h2>
            <p className="text-muted-foreground mb-6">
              To increase your chances of finding matches:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add more books that you're willing to swap</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add books you're looking for to your wishlist</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check back regularly as new books are added daily</span>
              </li>
            </ul>
            <Button asChild className="bg-bookswap-darkblue hover:bg-bookswap-darkblue/90">
              <Link to="/add">Add More Books</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {matches.map((match) => (
              <div key={match.user.id} className="bg-white border border-border rounded-lg overflow-hidden">
                <div className="bg-bookswap-blue p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{match.user.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Neighborhood: {match.user.neighborhood} • Match Score: {match.matchScore}/10
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-3 md:mt-0 bg-white"
                    onClick={() => handleStartChat(match.user.id)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Books They Have (That You Want)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {match.user.booksOffered.map((book) => (
                        <BookCard 
                          key={book.id} 
                          book={book} 
                          onRequestSwap={handleRequestSwap} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold mb-3">Books They Want (That You Have)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {match.user.booksWanted.map((book) => (
                        <BookCard 
                          key={book.id} 
                          book={book} 
                          onRequestSwap={handleRequestSwap}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
