import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllBorrowings } from "@/hooks/useBorrowings";
import { Search, BookOpen } from "lucide-react";
import { format, isPast } from "date-fns";

const AllBorrowings = () => {
  const { data: borrowings, isLoading } = useAllBorrowings();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBorrowings = borrowings?.filter(
    (b) =>
      b.books?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === "returned") {
      return <Badge variant="secondary">Returned</Badge>;
    }
    if (isPast(new Date(dueDate))) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <div>
            <CardTitle>All Borrowings</CardTitle>
            <CardDescription>Complete history of all book borrowings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by book or borrower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-muted-foreground">Loading...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowings?.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{borrowing.books?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {borrowing.books?.author}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{borrowing.profiles?.full_name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">
                          {borrowing.profiles?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(borrowing.borrow_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(borrowing.due_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {borrowing.return_date
                        ? format(new Date(borrowing.return_date), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(borrowing.status, borrowing.due_date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllBorrowings;
