-- Add RLS policies for user_roles INSERT/UPDATE/DELETE
-- Only librarians can manage user roles

-- Policy for INSERT - only librarians can add roles
CREATE POLICY "Only librarians can insert roles"
ON public.user_roles 
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'librarian'::app_role));

-- Policy for UPDATE - only librarians can update roles
CREATE POLICY "Only librarians can update roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'librarian'::app_role));

-- Policy for DELETE - only librarians can delete roles
CREATE POLICY "Only librarians can delete roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'librarian'::app_role));