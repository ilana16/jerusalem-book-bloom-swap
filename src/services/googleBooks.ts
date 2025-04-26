
const GOOGLE_BOOKS_API_KEY = 'AIzaSyDSGm97K_kt3evfXe3klrPtNF1Q4vrW_2Y';
const BASE_URL = 'https://www.googleapis.com/books/v1';

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
  };
}

export const searchBooks = async (query: string): Promise<GoogleBook[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};
