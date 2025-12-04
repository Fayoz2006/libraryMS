import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBooks, useAddBook, useUpdateBook, useDeleteBook, Book } from "@/hooks/useBooks";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface BookManagementProps {
  canDelete?: boolean;
}

const BookManagement = ({ canDelete = false }: BookManagementProps) => {
  const { data: books, isLoading } = useBooks();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    total_copies: 1,
    available_copies: 1,
    cover_url: "",
  });

  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
  );

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
      total_copies: 1,
      available_copies: 1,
      cover_url: "",
    });
    setEditingBook(null);
  };

  const handleAdd = () => {
    addBook.mutate(formData, {
      onSuccess: () => {
        setIsAddOpen(false);
        resetForm();
      },
    });
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category || "",
      description: book.description || "",
      total_copies: book.total_copies,
      available_copies: book.available_copies,
      cover_url: book.cover_url || "",
    });
  };

  const handleUpdate = () => {
    if (!editingBook) return;
    updateBook.mutate(
      { id: editingBook.id, ...formData },
      {
        onSuccess: () => {
          setEditingBook(null);
          resetForm();
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBook.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Book Management</CardTitle>
            <CardDescription>Add, edit, or remove books from the library</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Enter the book details below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="total">Total Copies</Label>
                    <Input
                      id="total"
                      type="number"
                      min="1"
                      value={formData.total_copies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_copies: parseInt(e.target.value),
                          available_copies: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={addBook.isPending}>
                  {addBook.isPending ? "Adding..." : "Add Book"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center py-4 text-muted-foreground">Loading...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                    <TableCell>{book.category || "-"}</TableCell>
                    <TableCell className="text-center">
                      {book.available_copies}/{book.total_copies}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={editingBook?.id === book.id}
                          onOpenChange={(open) => !open && resetForm()}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                              <DialogDescription>Update the book details</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input
                                  value={formData.title}
                                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Author</Label>
                                <Input
                                  value={formData.author}
                                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Category</Label>
                                <Input
                                  value={formData.category}
                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label>Total Copies</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={formData.total_copies}
                                    onChange={(e) =>
                                      setFormData({ ...formData, total_copies: parseInt(e.target.value) })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Available</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max={formData.total_copies}
                                    value={formData.available_copies}
                                    onChange={(e) =>
                                      setFormData({ ...formData, available_copies: parseInt(e.target.value) })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={resetForm}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdate} disabled={updateBook.isPending}>
                                {updateBook.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
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

export default BookManagement;
