import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useMyBorrowings, useReturnBook } from "@/hooks/useBorrowings";
import { useBooks } from "@/hooks/useBooks";
import { BookOpen, Clock, CheckCircle, AlertCircle, Plus, Library } from "lucide-react";
import { format, isPast } from "date-fns";
import BookManagement from "@/components/admin/BookManagement";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { data: borrowings, isLoading } = useMyBorrowings();
  const { data: books } = useBooks();
  const returnBook = useReturnBook();

  const activeBorrowings = borrowings?.filter((b) => b.status === "active") || [];
  const returnedBorrowings = borrowings?.filter((b) => b.status === "returned") || [];
  const overdueBorrowings = activeBorrowings.filter((b) => isPast(new Date(b.due_date)));

  const handleReturn = (borrowingId: string, bookId: string) => {
    returnBook.mutate({ borrowingId, bookId });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Faculty Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || "Faculty Member"}</p>
      </div>

      <Tabs defaultValue="borrowings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="borrowings">My Borrowings</TabsTrigger>
          <TabsTrigger value="books">Book Management</TabsTrigger>
        </TabsList>

        <TabsContent value="borrowings">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBorrowings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{overdueBorrowings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <Library className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{books?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Faculty Limit</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10 books</div>
                <p className="text-xs text-muted-foreground">Extended borrowing</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Borrowings */}
          <Card>
            <CardHeader>
              <CardTitle>My Borrowed Books</CardTitle>
              <CardDescription>Faculty members can borrow up to 10 books for 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : activeBorrowings.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">No active borrowings</p>
                  <Link to="/catalog">
                    <Button variant="link">Browse the catalog</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBorrowings.map((borrowing) => {
                    const isOverdue = isPast(new Date(borrowing.due_date));
                    return (
                      <div key={borrowing.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{borrowing.books?.title}</h4>
                          <p className="text-sm text-muted-foreground">by {borrowing.books?.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            <span className={`text-sm ${isOverdue ? "text-destructive" : ""}`}>
                              Due: {format(new Date(borrowing.due_date), "MMM d, yyyy")}
                            </span>
                            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                          </div>
                        </div>
                        <Button onClick={() => handleReturn(borrowing.id, borrowing.book_id)} disabled={returnBook.isPending}>
                          Return
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <BookManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;
