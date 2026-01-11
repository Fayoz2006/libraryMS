import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, BookOpen, Loader2 } from "lucide-react";
import { useBooks, Book } from "@/hooks/useBooks";
import { useBorrowBook } from "@/hooks/useBorrowings";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);

  const { data: books, isLoading } = useBooks();
  const borrowBook = useBorrowBook();
  const { user } = useAuth();
  const { isFaculty } = useUserRole();
  const { toast } = useToast();

  const categories = useMemo(() => {
    if (!books) return ["All"];
    const cats = [...new Set(books.map((b) => b.category).filter(Boolean))];
    return ["All", ...cats];
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const matchesAvailability = !showAvailableOnly || book.available_copies > 0;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, searchQuery, selectedCategory, showAvailableOnly]);

  const handleBorrow = () => {
    if (!borrowingBook || !user) return;
    const daysToKeep = isFaculty ? 30 : 14; // Faculty gets 30 days, students get 14
    borrowBook.mutate(
      { bookId: borrowingBook.id, daysToKeep },
      {
        onSuccess: () => {
          setBorrowingBook(null);
        },
      }
    );
  };

  const handleBorrowClick = (book: Book) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to borrow books",
        variant: "destructive",
      });
      return;
    }
    if (book.available_copies <= 0) {
      toast({
        title: "Not available",
        description: "This book is currently not available",
        variant: "destructive",
      });
      return;
    }
    setBorrowingBook(book);
  };

  return (
    <>
      <Helmet>
        <title>Book Catalog - LibraryMS</title>
        <meta
          name="description"
          content="Browse our collection of books. Search by title, author, or ISBN. Filter by category and availability."
        />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="bg-hero text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-accent" />
                <span className="text-accent font-medium">Book Catalog</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Explore Our Collection
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Search through thousands of books available in our library. Find your next great read.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b border-border bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category as string)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Available Filter */}
              <Button
                variant={showAvailableOnly ? "default" : "outline"}
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Available Only
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredBooks.length}</span> books
              </p>
              {(searchQuery || selectedCategory !== "All" || showAvailableOnly) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setShowAvailableOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                        {book.cover_url ? (
                          <img 
                            src={book.cover_url} 
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-16 h-16 text-primary/30" />
                        )}
                      </div>
                      <div className="p-4">
                        <Badge variant={book.available_copies > 0 ? "default" : "secondary"} className="mb-2">
                          {book.available_copies > 0 ? `${book.available_copies} Available` : "Unavailable"}
                        </Badge>
                        <h3 className="font-serif font-semibold text-foreground line-clamp-2 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                        {book.category && (
                          <Badge variant="outline" className="mb-3">{book.category}</Badge>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                          {book.description || "No description available"}
                        </p>
                        <Button
                          className="w-full"
                          variant={book.available_copies > 0 ? "default" : "secondary"}
                          disabled={book.available_copies <= 0}
                          onClick={() => handleBorrowClick(book)}
                        >
                          {book.available_copies > 0 ? "Borrow Book" : "Not Available"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  No books found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Borrow Confirmation Dialog */}
        <Dialog open={!!borrowingBook} onOpenChange={() => setBorrowingBook(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Borrowing</DialogTitle>
              <DialogDescription>
                You are about to borrow this book. Please confirm.
              </DialogDescription>
            </DialogHeader>
            {borrowingBook && (
              <div className="py-4">
                <h4 className="font-semibold text-lg">{borrowingBook.title}</h4>
                <p className="text-muted-foreground">by {borrowingBook.author}</p>
                <p className="text-sm mt-2">ISBN: {borrowingBook.isbn}</p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Loan period:</strong> {isFaculty ? "30 days" : "14 days"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isFaculty
                      ? "As faculty, you have extended borrowing privileges."
                      : "Please return the book before the due date to avoid penalties."}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setBorrowingBook(null)}>
                Cancel
              </Button>
              <Button onClick={handleBorrow} disabled={borrowBook.isPending}>
                {borrowBook.isPending ? "Processing..." : "Confirm Borrow"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default Catalog;
