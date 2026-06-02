"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

const BooksPage = ({ data = [] }) => {
  const router = useRouter();
  const [openId, setOpenId] = useState(null);
  const supabase = createClient();

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) {
        console.error("Error deleting book:", error);
      } else {
        toast.success("Book deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the book");
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <div className="flex justify-between w-full">
        <div></div>
        <Link
          href="/books/add"
          className={buttonVariants({ variant: "default" })}
        >
          Add Books
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your books.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>ISBN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((book, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.publisher}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/books/details/${book.id}`)}
                  className="cursor-pointer"
                >
                  Details
                </Button>
                <Popover
                  open={openId === book.id}
                  onOpenChange={(open) => {
                    setOpenId(open ? book.id : null);
                  }}
                >
                  <PopoverTrigger
                    className={buttonVariants({
                      variant: "destructive",
                      size: "sm",
                      className: "h-8 px-3 cursor-pointer",
                    })}
                  >
                    Delete
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <PopoverHeader>
                      <PopoverTitle>
                        Yakin ingin menghapus data ini?
                      </PopoverTitle>
                    </PopoverHeader>
                    <div className="space-y-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => setOpenId(null)}
                        >
                          Tidak
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            handleDelete(book.id);
                            setOpenId(null);
                          }}
                          className="h-8 px-3 text-xs"
                        >
                          Ya, Hapus
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BooksPage;
