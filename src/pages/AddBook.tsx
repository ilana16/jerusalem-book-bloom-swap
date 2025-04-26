
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { GoogleBook, searchBooks } from "@/services/googleBooks";

const conditions = ["Like New", "Very Good", "Good", "Fair", "Poor"];
const neighborhoods = [
  "Baka",
  "German Colony",
  "Katamon",
  "Rehavia",
  "City Center",
  "Talpiot",
  "Arnona",
  "French Hill",
  "Ramot",
  "Gilo",
  "Pisgat Ze'ev",
  "Har Nof",
  "Bayit Vegan",
  "Nachlaot",
  "Kiryat Moshe",
  "Old City"
];

const coverColors = [
  { name: "Blue", value: "#436B95" },
  { name: "Green", value: "#4A6741" },
  { name: "Red", value: "#9C4A41" },
  { name: "Purple", value: "#5D4A9C" },
  { name: "Orange", value: "#BC6C25" },
  { name: "Teal", value: "#2A9D8F" },
];

const AddBook = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    condition: "",
    neighborhood: "",
    coverColor: "#436B95"
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error("Error searching for books");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookSelect = (book: GoogleBook) => {
    setSelectedBook(book);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, coverColor: color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      toast.error("Please select a book first");
      return;
    }
    if (!formData.condition || !formData.neighborhood) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, we would send this data to the backend
    toast.success("Book added successfully!");
    navigate("/books");
  };

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        <h1 className="section-heading">Add Your Book</h1>
        
        <div className="bg-white border border-border rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Book Search Section */}
              <div className="space-y-4">
                <Label>Search for your book</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 border rounded-md divide-y">
                    {searchResults.map((book) => (
                      <div
                        key={book.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleBookSelect(book)}
                      >
                        <div className="flex items-start gap-4">
                          {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                              src={book.volumeInfo.imageLinks.thumbnail}
                              alt={book.volumeInfo.title}
                              className="w-16 h-auto"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{book.volumeInfo.title}</h3>
                            {book.volumeInfo.authors && (
                              <p className="text-sm text-muted-foreground">
                                by {book.volumeInfo.authors.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Book Display */}
                {selectedBook && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex items-start gap-4">
                      {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                        <img
                          src={selectedBook.volumeInfo.imageLinks.thumbnail}
                          alt={selectedBook.volumeInfo.title}
                          className="w-20 h-auto"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{selectedBook.volumeInfo.title}</h3>
                        {selectedBook.volumeInfo.authors && (
                          <p className="text-sm text-muted-foreground">
                            by {selectedBook.volumeInfo.authors.join(", ")}
                          </p>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-2 h-8 text-sm"
                          onClick={() => setSelectedBook(null)}
                        >
                          Change Book
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                    required
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Your Neighborhood *</Label>
                  <Select
                    value={formData.neighborhood}
                    onValueChange={(value) => handleSelectChange("neighborhood", value)}
                    required
                  >
                    <SelectTrigger id="neighborhood">
                      <SelectValue placeholder="Select neighborhood" />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map(neighborhood => (
                        <SelectItem key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Book Cover Color</Label>
                <div className="grid grid-cols-6 gap-3">
                  {coverColors.map(color => (
                    <div 
                      key={color.value}
                      className={`h-12 rounded-md cursor-pointer transition-all border-2 ${
                        formData.coverColor === color.value 
                          ? 'border-black scale-105' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorSelect(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-bookswap-darkblue hover:bg-bookswap-darkblue/90"
                  disabled={!selectedBook || !formData.condition || !formData.neighborhood}
                >
                  Add Book to Swap List
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>All books added are available for swapping. There are no points or financial transactions.</p>
          <p>Book Swap Jerusalem is based on goodwill and community sharing.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
