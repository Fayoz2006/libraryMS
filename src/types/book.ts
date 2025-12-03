export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverImage: string;
  available: boolean;
  publishedYear: number;
  pages: number;
  language: string;
}

export interface Borrowing {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned" | "overdue";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "librarian";
  borrowedBooks: number;
  maxBooks: number;
}
