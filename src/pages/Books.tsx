
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { BookList } from "@/components/common/BookList";
import { mockBooks } from "@/data/mockBooks";
import { NeighborhoodFilter } from "@/components/common/NeighborhoodFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNeighborhood = 
      selectedNeighborhoods.length === 0 || 
      selectedNeighborhoods.includes(book.owner.neighborhood);
    
    return matchesSearch && matchesNeighborhood;
  });

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
            Showing {filteredBooks.length} of {mockBooks.length} books
          </p>
        </div>

        <BookList 
          books={filteredBooks} 
          emptyMessage="No books match your search criteria. Try adjusting your filters or add your own books to share!"
        />
      </div>
    </Layout>
  );
};

export default Books;
