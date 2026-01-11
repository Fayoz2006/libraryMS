-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);

-- Allow anyone to view book covers
CREATE POLICY "Book covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

-- Allow authenticated users to upload book covers
CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update book covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete book covers
CREATE POLICY "Authenticated users can delete book covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'book-covers' AND auth.role() = 'authenticated');