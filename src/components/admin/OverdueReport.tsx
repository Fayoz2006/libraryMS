import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertCircle } from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";

const OverdueReport = () => {
  const { data: borrowings, isLoading } = useAllBorrowings();

  const overdueBorrowings = borrowings?.filter(
    (b) => b.status === "active" && isPast(new Date(b.due_date))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <CardTitle>Overdue Books Report</CardTitle>
            <CardDescription>
              {overdueBorrowings?.length || 0} books are currently overdue
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-4 text-muted-foreground">Loading...</p>
        ) : overdueBorrowings?.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">No overdue books! Great job.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueBorrowings?.map((borrowing) => {
                  const daysOverdue = differenceInDays(new Date(), new Date(borrowing.due_date));
                  return (
                    <TableRow key={borrowing.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{borrowing.books?.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {borrowing.books?.author}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{borrowing.profiles?.full_name || "Unknown"}</TableCell>
                      <TableCell>{borrowing.profiles?.email || "-"}</TableCell>
                      <TableCell>{format(new Date(borrowing.due_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{daysOverdue} days</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueReport;
