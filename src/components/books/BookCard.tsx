import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Book as BookType } from "@/types/book";

interface BookCardProps {
  book: BookType;
  index?: number;
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  return (
    <Link
      to={`/book/${book.id}`}
      className="group block"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
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
        </div>

        {/* Book Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {book.category}
          </p>
          <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
