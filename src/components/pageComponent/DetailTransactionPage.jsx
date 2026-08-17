"use client";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const StatusBadge = ({ status }) => {
  if (status === "returned") return <Badge variant="outline">Returned</Badge>;
  if (status === "overdue")
    return <Badge variant="destructive">Overdue</Badge>;
  return (
    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      Borrowed
    </Badge>
  );
};

const getItemStatus = (item, dueDate) => {
  if (item.status === "returned") return "returned";
  if (new Date(dueDate) < new Date()) return "overdue";
  return "borrowed";
};

const DetailTransactionPage = ({ borrowing }) => {
  const router = useRouter();
  const supabase = createClient();
  const [openId, setOpenId] = useState(null);

  const handleReturnBook = async (borrowingItemId) => {
    try {
      const { error } = await supabase.rpc("return_book", {
        p_borrowing_item_id: borrowingItemId,
      });

      if (error) {
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

  const items = borrowing.borrowings_items ?? [];
  const overallStatus = getItemStatus(
    { status: borrowing.status },
    borrowing.due_date,
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detail Peminjaman</h1>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push("/transactions")}
        >
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Peminjam</p>
            <p className="font-medium">{borrowing.members?.name ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">No. HP</p>
            <p className="font-medium">{borrowing.members?.phone ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tanggal Peminjaman</p>
            <p className="font-medium">
              {borrowing.borrowed_at
                ? format(new Date(borrowing.borrowed_at), "PPP")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tenggat Waktu</p>
            <p className="font-medium">
              {borrowing.due_date
                ? format(new Date(borrowing.due_date), "PPP")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge status={overallStatus} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jumlah Buku</p>
            <p className="font-medium">{items.length}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Buku yang Dipinjam</h2>
        <Table>
          <TableCaption>Daftar buku dalam transaksi peminjaman ini.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Judul Buku</TableHead>
              <TableHead>Pengarang</TableHead>
              <TableHead>Kode Exemplar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Kembali</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada buku dalam transaksi ini
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const itemStatus = getItemStatus(item, borrowing.due_date);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.book_copies?.books?.title ?? "-"}</TableCell>
                    <TableCell>{item.book_copies?.books?.author ?? "-"}</TableCell>
                    <TableCell>{item.book_copies?.copy_code ?? "-"}</TableCell>
                    <TableCell>
                      <StatusBadge status={itemStatus} />
                    </TableCell>
                    <TableCell>
                      {item.returned_at
                        ? format(new Date(item.returned_at), "PPP")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Popover
                        open={openId === item.id}
                        onOpenChange={(open) => setOpenId(open ? item.id : null)}
                      >
                        <PopoverTrigger
                          disabled={item.status === "returned"}
                          className={buttonVariants({
                            size: "sm",
                            className: "h-8 px-3 cursor-pointer",
                          })}
                        >
                          Return
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <p className="text-sm font-medium mb-3">
                            Yakin ingin mengembalikan buku ini?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setOpenId(null)}
                            >
                              Tidak
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                handleReturnBook(item.id);
                                setOpenId(null);
                              }}
                            >
                              Ya, Return
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DetailTransactionPage;
