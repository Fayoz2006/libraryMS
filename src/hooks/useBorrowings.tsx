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

      // Use atomic database function to prevent race conditions
      const { error } = await supabase.rpc("borrow_book", {
        p_book_id: bookId,
        p_user_id: user.id,
        p_due_date: dueDate.toISOString(),
      });
      
      if (error) throw error;
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
      // Use atomic database function to prevent race conditions
      const { error } = await supabase.rpc("return_book", {
        p_borrowing_id: borrowingId,
        p_book_id: bookId,
      });
      
      if (error) throw error;
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
