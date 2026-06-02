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
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  isbn: z.string().min(1, "ISBN is required"),
  code: z.string().min(1, "Code is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const AddBooks = () => {
  const supabase = createClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      code: "",
      quantity: 1,
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.rpc("create_book", {
        p_title: data.title,
        p_author: data.author,
        p_publisher: data.publisher,
        p_isbn: data.isbn,
        p_code: data.code,
        p_quantity: Number(data.quantity),
      });

      if (error) throw error;

      toast.success("Book added successfully!");

      router.push("/books");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1>Add Books</h1>
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
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input
                    id="code"
                    type="text"
                    placeholder="BOOK001"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1"
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
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default AddBooks;
