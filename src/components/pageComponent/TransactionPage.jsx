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
import { format } from "date-fns";

const TransactionPage = ({ data = [] }) => {
  const router = useRouter();
  const [openId, setOpenId] = useState(null);
  const supabase = createClient();

  const handleReturnBook = async (borrowingItemId) => {
    try {
      const { error } = await supabase.rpc("return_book", {
        p_borrowing_item_id: borrowingItemId,
      });

      if (error) {
        console.error("Error returning book:", error);
        toast.error(error.message);
        return;
      }

      toast.success("Book returned successfully");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="flex justify-between w-full">
        <div></div>
        <Link
          href="/transactions/add"
          className={buttonVariants({ variant: "default" })}
        >
          Add Transactions
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Peminjam</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Tanggal Peminjaman</TableHead>
            <TableHead>Tenggat Waktu</TableHead>
            <TableHead>Tanggal Pengembalian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{transaction.member_name}</TableCell>
              <TableCell>{transaction.book_title}</TableCell>
              <TableCell>
                {transaction.borrowed_at
                  ? format(new Date(transaction.borrowed_at), "yyyy-MM-dd")
                  : "-"}
              </TableCell>
              <TableCell>
                {transaction.due_date
                  ? format(new Date(transaction.due_date), "yyyy-MM-dd")
                  : "-"}
              </TableCell>
              <TableCell>
                {transaction.returned_at
                  ? format(new Date(transaction.returned_at), "yyyy-MM-dd")
                  : "-"}
              </TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell className="flex gap-2">
                <Popover
                  open={openId === transaction.id}
                  // disabled={transaction.status === "returned"}
                  onOpenChange={(open) => {
                    setOpenId(open ? transaction.id : null);
                  }}
                >
                  <PopoverTrigger
                    disabled={transaction.status === "returned"}
                    className={buttonVariants({
                      size: "sm",
                      className: "h-8 px-3 cursor-pointer",
                    })}
                  >
                    Return Book
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
                            handleReturnBook(transaction.id);
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

export default TransactionPage;
