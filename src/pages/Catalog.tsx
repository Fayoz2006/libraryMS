import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";
import { sampleBooks, categories } from "@/data/books";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredBooks = useMemo(() => {
    return sampleBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const matchesAvailability = !showAvailableOnly || book.available;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [searchQuery, selectedCategory, showAvailableOnly]);

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
                    onClick={() => setSelectedCategory(category)}
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
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
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
      </Layout>
    </>
  );
};

export default Catalog;
