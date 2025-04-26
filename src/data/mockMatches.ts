
import { Book } from "@/components/common/BookCard";
import { mockBooks } from "./mockBooks";

// Create a subset of books for match examples
const userBooks = mockBooks.slice(0, 3);
const otherUserBooks = mockBooks.slice(3, 5);
const differentUserBooks = mockBooks.slice(5, 6);

export const mockMatches = [
  {
    user: {
      id: "user1",
      name: "Sarah Cohen",
      neighborhood: "Baka",
      booksOffered: otherUserBooks,
      booksWanted: userBooks.slice(0, 2)
    },
    matchScore: 9
  },
  {
    user: {
      id: "user2",
      name: "David Levy",
      neighborhood: "German Colony",
      booksOffered: differentUserBooks,
      booksWanted: userBooks.slice(1, 3)
    },
    matchScore: 7
  }
];
