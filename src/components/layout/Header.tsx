
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Book, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-bookswap-darkblue" />
          <Link to="/" className="font-playfair font-bold text-xl md:text-2xl text-bookswap-darkblue">
            Book Swap Jerusalem
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            {mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white border-b border-border p-4 shadow-lg animate-fade-in">
                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/books" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Browse Books
                  </Link>
                  <Link to="/add" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Add Book
                  </Link>
                  <Link to="/matches" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    My Matches
                  </Link>
                  <Link to="/chat" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    Messages
                  </Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex space-x-2">
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 hover:bg-muted rounded-md text-sm">
                Home
              </Link>
              <Link to="/books" className="px-3 py-2 hover:bg-muted rounded-md text-sm">
                Browse Books
              </Link>
              <Link to="/add" className="px-3 py-2 hover:bg-muted rounded-md text-sm">
                Add Book
              </Link>
              <Link to="/matches" className="px-3 py-2 hover:bg-muted rounded-md text-sm">
                My Matches
              </Link>
              <Link to="/chat" className="px-3 py-2 hover:bg-muted rounded-md text-sm">
                Messages
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
