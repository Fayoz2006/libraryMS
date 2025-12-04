import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Borrowing {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  books?: {
    title: string;
    author: string;
    isbn: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

export const useMyBorrowings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-borrowings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("borrowings")
        .select("*, books(title, author, isbn)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Borrowing[];
    },
    enabled: !!user,
  });
};

export const useAllBorrowings = () => {
  return useQuery({
    queryKey: ["all-borrowings"],
    queryFn: async () => {
      const { data: borrowingsData, error: borrowingsError } = await supabase
        .from("borrowings")
        .select("*, books(title, author, isbn)")
        .order("created_at", { ascending: false });
      if (borrowingsError) throw borrowingsError;

      // Get profiles for all borrowings
      const userIds = [...new Set(borrowingsData.map(b => b.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      return borrowingsData.map(b => ({
        ...b,
        profiles: profilesMap.get(b.user_id) || null
      })) as Borrowing[];
    },
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookId, daysToKeep = 14 }: { bookId: string; daysToKeep?: number }) => {
      if (!user) throw new Error("Must be logged in to borrow");

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysToKeep);

      // Create borrowing
      const { error: borrowError } = await supabase.from("borrowings").insert({
        user_id: user.id,
        book_id: bookId,
        due_date: dueDate.toISOString(),
      });
      if (borrowError) throw borrowError;

      // Decrease available copies
      const { data: book } = await supabase.from("books").select("available_copies").eq("id", bookId).single();
      if (book && book.available_copies > 0) {
        await supabase.from("books").update({ available_copies: book.available_copies - 1 }).eq("id", bookId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrowings"] });
      toast({ title: "Book borrowed successfully", description: "Check your borrowings for due date." });
    },
    onError: (error: Error) => {
      toast({ title: "Error borrowing book", description: error.message, variant: "destructive" });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ borrowingId, bookId }: { borrowingId: string; bookId: string }) => {
      // Update borrowing status
      const { error: borrowError } = await supabase
        .from("borrowings")
        .update({ status: "returned", return_date: new Date().toISOString() })
        .eq("id", borrowingId);
      if (borrowError) throw borrowError;

      // Increase available copies
      const { data: book } = await supabase.from("books").select("available_copies").eq("id", bookId).single();
      if (book) {
        await supabase.from("books").update({ available_copies: book.available_copies + 1 }).eq("id", bookId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["all-borrowings"] });
      toast({ title: "Book returned successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error returning book", description: error.message, variant: "destructive" });
    },
  });
};
