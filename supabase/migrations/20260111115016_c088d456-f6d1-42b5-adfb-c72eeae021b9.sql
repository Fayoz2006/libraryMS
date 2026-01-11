-- Add check constraints to prevent invalid copy counts
ALTER TABLE public.books ADD CONSTRAINT books_available_copies_check 
CHECK (available_copies >= 0 AND available_copies <= total_copies);

-- Create atomic borrow_book function to prevent race conditions
CREATE OR REPLACE FUNCTION public.borrow_book(p_book_id UUID, p_user_id UUID, p_due_date TIMESTAMPTZ)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atomically decrement available copies with row-level locking
  UPDATE books 
  SET available_copies = available_copies - 1,
      updated_at = now()
  WHERE id = p_book_id AND available_copies > 0;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not available for borrowing';
  END IF;
  
  -- Insert borrowing record
  INSERT INTO borrowings (user_id, book_id, due_date)
  VALUES (p_user_id, p_book_id, p_due_date);
END;
$$;

-- Create atomic return_book function to prevent race conditions
CREATE OR REPLACE FUNCTION public.return_book(p_borrowing_id UUID, p_book_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update borrowing status
  UPDATE borrowings 
  SET status = 'returned', 
      return_date = now(),
      updated_at = now()
  WHERE id = p_borrowing_id AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Borrowing not found or already returned';
  END IF;
  
  -- Atomically increment available copies
  UPDATE books 
  SET available_copies = available_copies + 1,
      updated_at = now()
  WHERE id = p_book_id;
END;
$$;