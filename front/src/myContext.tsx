import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router';



// I AM SO STUPID!!! I USED USECONTEXT TO STORE AND SET ALL USER INFORMATION SO I WOULDNT HAVE
// TO REPETITVELY SEND HTTP REQUEST BUT I FORGOT THAT I DID THAT.
// SO NOW IM REQUESTION NEW INFO EVERYTIME WHICH IS WHY THIS CRAP IS SO REDUNDANT!!!

// In the future could potentiall make different files for each section
// Each section could have a object with the corresponding updates, delete, get, create methods.

export interface User {
  id: number;
  username: string;
  email: string;
  last_login: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

export interface Book {
  book_id: number;
  title: string;
  description: string;
  cover_image_url: string;
  rating: number;
  created_at: string;
  created_by: number;
}

export interface Chapter {
  chapter_id: number;
  book_id: number;
  chapter_number: number;
  title: string;
}

export interface Quote {
  quote_id: number;
  chapter_id: number;
  quote_text: string;
  context?: string;
  explanation?: string;
  context_image_location?: string;
  quote_number: number;
  created_at: string;
}

export interface SubQuote {
  subquote_id: number;
  quote_id: number;
  subquote_text: string;
  explanation?: string;
  subquote_number: number;
}

export interface Tag {
  tag_id: number;
  name: string;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const API_BASE_URL = 'http://localhost:3000/api';
export const BASE_URL = 'http://localhost:3000';
export const bookImgUrl = 'http://localhost:3000/api/book-covers/'


export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log("sending");
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const answer = await response.json();
      console.log("received: ", answer);

      setUser({
        id: answer.user_id,
        username: answer.username,
        email: answer.email,
        last_login: answer.last_login
      });
    } catch (error) {
      console.error('Login error:', error);
      // Handle error appropriately (e.g., show to user)
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {

      //sign up
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      //if succeful then call the login function.
      const answer = await response.json();
      console.log("received: ", answer);

      login(email, password);

    } catch (error) {
      console.error('register error:', error);
      // Handle error appropriately (e.g., show to user)
    }

  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Let id be set to string or number for random or specified without having 2 functions
export const getBook = async (id: number | string): Promise<Book> => {

  if (id === 'randomBook') {
    const response = await fetch(`${API_BASE_URL}/randomBook`);
    if (!response.ok) {
      throw new Error('Book not rand found');
    }
    return response.json();
  } else {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Book not found');
    }
    return response.json();
  }

};

export const getTags = async (numberOfTags?: number): Promise<Tag[]> => {
  let response;

  if (numberOfTags) {
    response = await fetch(`${API_BASE_URL}/tags?limit=${numberOfTags}`); // query string
  } else {
    response = await fetch(`${API_BASE_URL}/tags`);
  }
  if (!response.ok) {
    throw new Error('Failed to get tags');
  }
  return response.json();
};

export const getTagsByBook = async (bookID: number): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/${bookID}/tags`); // query string
  if (!response.ok) {
    throw new Error('Failed to get tags');
  }
  return response.json();
};

export const getBooksByTag = async (tagId: number): Promise<Book[]> => {
  try {
    const response = await fetch(`${BASE_URL}/books/tag/${tagId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const books = await response.json();
    //console.log("these are the books", books);
    return books;
  } catch (error) {
    console.error('Error fetching books by tag:', error);
    throw error;
  }
}

export const getChapters = async (bookId: number): Promise<Chapter[]> => {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}/chapters`);
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    const chapters = await response.json();
    return chapters;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getAChapter = async (bookId: number, chapter: number): Promise<Chapter> => {
  try {
    const response = await fetch(`${BASE_URL}/getChapter/${bookId}/${chapter}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    const chapters = await response.json();
    return chapters;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getChapterQuotes = async (chapterId: number): Promise<Quote[]> => {
  const response = await fetch(`${BASE_URL}/chapterQuotes/${chapterId}/quotes`);
  if (!response.ok) {
    throw new Error('Failed to fetch quotes');
  }
  return response.json();
};

export const getQuote = async (quoteId: number): Promise<Quote> => {
  const response = await fetch(`${BASE_URL}/quotes/${quoteId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  return response.json();
};

export const getQuoteSubquotes = async (quoteId: number): Promise<SubQuote[]> => {
  const response = await fetch(`${BASE_URL}/quotes/${quoteId}/subquotes`);
  if (!response.ok) {
    throw new Error('Failed to fetch subquotes');
  }
  return response.json();
}

export const getUserBooks = async (userId: number): Promise<Book[]> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch user books');
  }
  return response.json();
};

export const getUserFavoriteBooks = async (userId: number): Promise<Book[]> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/favorite-books`);
  if (!response.ok) {
    throw new Error('Failed to fetch favorite books');
  }
  return response.json();
};

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${BASE_URL}/GETALLDBBOOKS`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const toggleFavoriteStatus = async (userId: number, bookId: number): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/users/${userId}/favorites/toggle/${bookId}`,
      { method: 'POST' }
    );
    const result = await response.json();
    return result.isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const checkFavoriteStatus = async (userId: number, bookId: number): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/users/${userId}/favorites/${bookId}`
    );
    const result = await response.json();
    return result.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};

export const checkBookOwnership = async (userId: number, bookId: number): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/${bookId}/ownership/${userId}`
    );
    if (!response.ok) {
      throw new Error('Failed to check book ownership');
    }
    const result = await response.json();
    return result.isOwner;
  } catch (error) {
    console.error('Error checking book ownership:', error);
    return false;
  }
};

export const createBook = async (formData: FormData): Promise<Book> => {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to create book');
  }
  return response.json();
};

export const deleteBook = async (bookId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteBook/${bookId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


