"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import NewDataTable from "../shared/NewTable";
import PageHeader from "../shared/PageHeader";
import { Input } from "../ui/input";
import ActionCell from "../shared/ActionCell";

const BooksPage = ({ books = [], query = {} }) => {
  const router = useRouter();
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

  const form = useForm();

  const onSubmit = ({ search }) => {
    search
      ? router.push(`/books?search=${encodeURIComponent(search)}`)
      : router.push("/books");
  };

  const columns = [
    {
      key: "no",
      title: "No",
      dataIndex: "no",
      render: (value, record, index) => index + 1,
    },
    { key: "title", title: "Title", dataIndex: "title" },
    { key: "author", title: "Author", dataIndex: "author" },
    { key: "publisher", title: "Publisher", dataIndex: "publisher" },
    { key: "isbn", title: "ISBN", dataIndex: "isbn" },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (value, record) => (
        <ActionCell
          record={record}
          detailPath="/books/details"
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader title="Books" addHref="/books/add" addLabel="Add Book">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <Input
            {...form.register("search")}
            placeholder="Search books..."
            className="w-72"
          />

          <Button type="submit" size="icon-sm">
            <SearchIcon />
          </Button>
        </form>
      </PageHeader>
      <NewDataTable columns={columns} dataSource={books} query={query} />
    </div>
  );
};

export default BooksPage;
