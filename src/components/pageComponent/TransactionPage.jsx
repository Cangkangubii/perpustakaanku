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
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "../ui/badge";
import PageHeader from "../shared/PageHeader";
import BorrowingActionCell from "../shared/ActionTransaction";
import NewDataTable from "../shared/NewTable";

const TransactionPage = ({ dataSource = [], query }) => {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm();
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
  const onSubmit = ({ search }) => {
    search
      ? router.push(`/transactions?search=${encodeURIComponent(search)}`)
      : router.push("/transactions");
  };
  const columns = [
    {
      key: "no",
      title: "No",
      render: (_, __, index) => index + 1,
    },
    {
      key: "member_name",
      title: "Peminjam",
      dataIndex: "member_name",
    },
    {
      key: "book_title",
      title: "Judul Buku",
      dataIndex: "book_title",
    },
    {
      key: "borrowed_at",
      title: "Tanggal Peminjaman",
      dataIndex: "borrowed_at",
      render: (value) => (value ? format(new Date(value), "yyyy-MM-dd") : "-"),
    },
    {
      key: "due_date",
      title: "Tenggat Waktu",
      dataIndex: "due_date",
      render: (value) => (value ? format(new Date(value), "yyyy-MM-dd") : "-"),
    },
    {
      key: "returned_at",
      title: "Tanggal Pengembalian",
      dataIndex: "returned_at",
      render: (value) => (value ? format(new Date(value), "yyyy-MM-dd") : "-"),
    },
    {
      key: "status",
      title: "Status",
      render: (_, record) => (
        <>
          {record.status === "returned" && (
            <Badge variant="outline">Returned</Badge>
          )}

          {record.status === "borrowed" && (
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Borrowed
            </Badge>
          )}

          {record.status === "overdue" && (
            <Badge variant="destructive">Overdue</Badge>
          )}
        </>
      ),
    },
    {
      key: "actions",
      title: "Action",
      render: (_, record) => (
        <BorrowingActionCell record={record} onReturn={handleReturnBook} />
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Borrowings"
        addHref="/transactions/add"
        addLabel="Add Borrowing"
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <Input
            {...form.register("search")}
            placeholder="Search borrowings..."
            className="w-72"
          />

          <Button type="submit" size="icon-sm">
            <SearchIcon />
          </Button>
        </form>
      </PageHeader>
      <NewDataTable
        dataSource={dataSource}
        columns={columns}
        query={query}
        rowKey="id"
      />
    </div>
  );
};

export default TransactionPage;
