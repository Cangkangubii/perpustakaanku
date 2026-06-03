"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  isbn: z.string().min(1, "ISBN is required"),
});

const DetailBookPage = ({ initialValues = {} }) => {
  const supabase = createClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues.title || "",
      author: initialValues.author || "",
      publisher: initialValues.publisher || "",
      isbn: initialValues.isbn || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from("books")
        .update({ ...data, id: initialValues.id })
        .eq("id", initialValues.id);
      if (error) {
        toast.error("Failed to update book: " + error.message);
      } else {
        toast.success("Book updated successfully!");
        router.push("/books");
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error.message);
    }
  };

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-full">
      <Tabs defaultValue="details" className="w-full py-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger
            value="book-copy"
            onClick={() =>
              router.push("/books/details/" + initialValues.id + "/book-copy")
            }
          >
            Book Copies
          </TabsTrigger>
        </TabsList>
        <TabsContent></TabsContent>
      </Tabs>
      <h1 className="text-lg font-semibold">Detail Books</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet className="w-full max-w-md">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="title">Judul</FieldLabel>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Max Leiter"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="author"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="author">Pengarang</FieldLabel>
                  <Input
                    id="author"
                    type="text"
                    placeholder="John Doe"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="publisher"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="publisher">Penerbit</FieldLabel>
                  <Input
                    id="publisher"
                    type="text"
                    placeholder="Penerbit A"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="isbn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
                  <Input
                    id="isbn"
                    type="text"
                    placeholder="123-4567890123"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field orientation="responsive" className="justify-end ">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/books")}
              >
                Back
              </Button>
              <Button type="submit">Update</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default DetailBookPage;
