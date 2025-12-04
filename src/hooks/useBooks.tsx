import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string | null;
  description: string | null;
  cover_url: string | null;
  total_copies: number;
  available_copies: number;
  created_at: string;
  updated_at: string;
}

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title");
      if (error) throw error;
      return data as Book[];
    },
  });
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (book: Omit<Book, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("books").insert(book).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding book", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...book }: Partial<Book> & { id: string }) => {
      const { data, error } = await supabase.from("books").update(book).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating book", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({ title: "Book deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting book", description: error.message, variant: "destructive" });
    },
  });
};
