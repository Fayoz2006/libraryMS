import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, FileText, Globe, User } from "lucide-react";
import { sampleBooks } from "@/data/books";
import { useToast } from "@/hooks/use-toast";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const book = sampleBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/catalog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleBorrow = () => {
    if (!book.available) {
      toast({
        title: "Book Unavailable",
        description: "This book is currently borrowed by another user.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Please Sign In",
      description: "You need to sign in to borrow this book.",
    });
  };

  return (
    <>
      <Helmet>
        <title>{book.title} - LibraryMS</title>
        <meta
          name="description"
          content={`${book.title} by ${book.author}. ${book.description.slice(0, 150)}...`}
        />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          {/* Back Link */}
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-xl overflow-hidden shadow-lg bg-card">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleBorrow}
                    className="w-full"
                    size="lg"
                    variant={book.available ? "hero" : "secondary"}
                    disabled={!book.available}
                  >
                    {book.available ? "Borrow This Book" : "Currently Unavailable"}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{book.category}</Badge>
                <Badge
                  className={
                    book.available
                      ? "bg-success text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }
                >
                  {book.available ? "Available" : "Borrowed"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">by {book.author}</p>

              <p className="text-foreground/80 leading-relaxed text-lg mb-8">
                {book.description}
              </p>

              {/* Book Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl bg-card border border-border mb-8">
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="font-semibold">{book.publishedYear}</p>
                </div>
                <div className="text-center">
                  <FileText className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-semibold">{book.pages}</p>
                </div>
                <div className="text-center">
                  <Globe className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-semibold">{book.language}</p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-semibold text-xs">{book.isbn}</p>
                </div>
              </div>

              {/* Borrowing Info */}
              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="font-serif font-semibold text-lg mb-4">Borrowing Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Students can borrow for up to 14 days
                  </li>
                  <li className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    Faculty can borrow for up to 30 days
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Renewals are available if no one else has reserved the book
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BookDetails;
