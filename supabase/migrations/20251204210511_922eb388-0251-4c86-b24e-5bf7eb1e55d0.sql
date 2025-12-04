
-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  cover_url TEXT,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create borrowings table
CREATE TABLE public.borrowings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  borrow_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowings ENABLE ROW LEVEL SECURITY;

-- Books policies (everyone can view, only librarian/faculty can modify)
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);

CREATE POLICY "Librarians can insert books" ON public.books FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'librarian') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Librarians can update books" ON public.books FOR UPDATE 
USING (public.has_role(auth.uid(), 'librarian') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Librarians can delete books" ON public.books FOR DELETE 
USING (public.has_role(auth.uid(), 'librarian'));

-- Borrowings policies
CREATE POLICY "Users can view their own borrowings" ON public.borrowings FOR SELECT 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'librarian') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Users can create borrowings" ON public.borrowings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their borrowings" ON public.borrowings FOR UPDATE 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'librarian'));

-- Trigger for updated_at
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_borrowings_updated_at BEFORE UPDATE ON public.borrowings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample books
INSERT INTO public.books (title, author, isbn, category, description, total_copies, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 'A story of decadence and excess.', 5, 5),
('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 'A classic of modern American literature.', 3, 3),
('1984', 'George Orwell', '978-0451524935', 'Science Fiction', 'A dystopian social science fiction novel.', 4, 4),
('Pride and Prejudice', 'Jane Austen', '978-0141439518', 'Romance', 'A romantic novel of manners.', 2, 2),
('The Catcher in the Rye', 'J.D. Salinger', '978-0316769488', 'Fiction', 'A story about teenage angst and alienation.', 3, 3);
