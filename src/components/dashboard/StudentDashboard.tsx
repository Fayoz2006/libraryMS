import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useMyBorrowings, useReturnBook } from "@/hooks/useBorrowings";
import { BookOpen, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { format, isPast } from "date-fns";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: borrowings, isLoading } = useMyBorrowings();
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
          Welcome back, {user?.user_metadata?.full_name || "Student"}
        </h1>
        <p className="text-muted-foreground">Manage your borrowed books and explore the catalog</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Borrowings</CardTitle>
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
            <CardTitle className="text-sm font-medium">Returned</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnedBorrowings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <Search className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/catalog">
              <Button size="sm" className="w-full">Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Active Borrowings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Borrowings</CardTitle>
          <CardDescription>Books you currently have borrowed</CardDescription>
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
                  <div
                    key={borrowing.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{borrowing.books?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {borrowing.books?.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-sm ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                          Due: {format(new Date(borrowing.due_date), "MMM d, yyyy")}
                        </span>
                        {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleReturn(borrowing.id, borrowing.book_id)}
                      disabled={returnBook.isPending}
                    >
                      Return Book
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrowing History */}
      <Card>
        <CardHeader>
          <CardTitle>Borrowing History</CardTitle>
          <CardDescription>Previously borrowed books</CardDescription>
        </CardHeader>
        <CardContent>
          {returnedBorrowings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No borrowing history yet</p>
          ) : (
            <div className="space-y-2">
              {returnedBorrowings.slice(0, 5).map((borrowing) => (
                <div key={borrowing.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{borrowing.books?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Returned: {borrowing.return_date && format(new Date(borrowing.return_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant="secondary">Returned</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
