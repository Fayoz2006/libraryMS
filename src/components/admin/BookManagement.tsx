import { useState, useRef } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Search, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generate a unique ISBN-13 format
const generateISBN = (): string => {
  const prefix = "978";
  const group = Math.floor(Math.random() * 10).toString();
  const publisher = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const title = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  const baseISBN = `${prefix}${group}${publisher}${title}`;
  
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(baseISBN[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return `${baseISBN}${checkDigit}`;
};

interface BookManagementProps {
  canDelete?: boolean;
}

const BookManagement = ({ canDelete = false }: BookManagementProps) => {
  const { data: books, isLoading } = useBooks();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
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
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("book-covers")
      .upload(filePath, file);

    if (error) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("book-covers")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAdd = async () => {
    setIsUploading(true);
    try {
      let coverUrl = formData.cover_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          coverUrl = uploadedUrl;
        }
      }
      
      // Auto-generate ISBN if not provided
      const isbn = formData.isbn || generateISBN();
      
      addBook.mutate(
        { ...formData, cover_url: coverUrl, isbn },
        {
          onSuccess: () => {
            setIsAddOpen(false);
            resetForm();
          },
        }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormData(prev => ({ ...prev, isbn: generateISBN() }));
    setIsAddOpen(true);
  };


  const handleUpdate = async () => {
    if (!editingBook) return;
    setIsUploading(true);
    try {
      let coverUrl = formData.cover_url;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          coverUrl = uploadedUrl;
        }
      }
      
      updateBook.mutate(
        { id: editingBook.id, ...formData, cover_url: coverUrl },
        {
          onSuccess: () => {
            setEditingBook(null);
            resetForm();
          },
        }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setImagePreview(book.cover_url || null);
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
          <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsAddOpen(open); }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleOpenAdd}>
                <Plus className="w-4 h-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Enter the book details below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Image Upload */}
                <div className="grid gap-2">
                  <Label>Book Cover</Label>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-24 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted cursor-pointer hover:border-primary transition-colors overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or WebP (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
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
                  <Label htmlFor="isbn">ISBN (Auto-generated)</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    readOnly
                    className="bg-muted font-mono"
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={addBook.isPending || isUploading}>
                  {isUploading ? "Uploading..." : addBook.isPending ? "Adding..." : "Add Book"}
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
                            <Button variant="ghost" size="icon" onClick={() => handleEditBook(book)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                              <DialogDescription>Update the book details</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {/* Image Upload */}
                              <div className="grid gap-2">
                                <Label>Book Cover</Label>
                                <div className="flex items-center gap-4">
                                  <div 
                                    className="w-24 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted cursor-pointer hover:border-primary transition-colors overflow-hidden"
                                    onClick={() => editFileInputRef.current?.click()}
                                  >
                                    {imagePreview ? (
                                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                      <Image className="w-8 h-8 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      ref={editFileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => editFileInputRef.current?.click()}
                                      className="gap-2"
                                    >
                                      <Upload className="w-4 h-4" />
                                      Change Image
                                    </Button>
                                  </div>
                                </div>
                              </div>
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
                                <Label>ISBN</Label>
                                <Input
                                  value={formData.isbn}
                                  readOnly
                                  className="bg-muted font-mono"
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
                              <Button onClick={handleUpdate} disabled={updateBook.isPending || isUploading}>
                                {isUploading ? "Uploading..." : updateBook.isPending ? "Saving..." : "Save Changes"}
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
