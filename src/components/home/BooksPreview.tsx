import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import { sampleBooks } from "@/data/books";

const BooksPreview = () => {
  const featuredBooks = sampleBooks.slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Featured Books
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our latest additions and popular titles
            </p>
          </div>
          <Link to="/catalog">
            <Button variant="outline" className="gap-2">
              View All Books
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksPreview;
