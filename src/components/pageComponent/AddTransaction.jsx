"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { createClient } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { NewSelectComps } from "../customComps/newSelect";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const bookRowSchema = z.object({
  book_id: z.coerce.number({ message: "Buku wajib dipilih" }),
  copy_id: z.coerce.number({ message: "Exemplar wajib dipilih" }),
});

const formSchema = z.object({
  member_id: z.coerce.number({ message: "Peminjam wajib dipilih" }),
  due_date: z.date({ message: "Tanggal kembali wajib dipilih" }),
  books: z.array(bookRowSchema).min(1, "Minimal satu buku harus dipilih"),
});

const AddTransaction = ({ bookList = [], memberList = [] }) => {
  const supabase = createClient();
  const router = useRouter();

  const [bookCopiesMap, setBookCopiesMap] = useState({});

  const getBookCopies = async (bookId) => {
    if (bookCopiesMap[bookId]) return; // already cached
    try {
      const { data, error } = await supabase
        .from("bookCopies")
        .select("*")
        .eq("book_id", bookId)
        .eq("status", "available");
      if (error) throw error;
      setBookCopiesMap((prev) => ({ ...prev, [bookId]: data ?? [] }));
    } catch (error) {
      console.error("Error fetching book copies:", error);
      toast.error("Gagal mengambil data exemplar buku");
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: undefined,
      due_date: undefined,
      books: [{ book_id: undefined, copy_id: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "books",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        p_member_id: data.member_id,
        p_due_date: data.due_date.toISOString(),
        p_books: data.books.map((b) => ({
          book_id: b.book_id,
          copy_id: b.copy_id,
        })),
      };

      const { error } = await supabase.rpc("create_borrowing", payload);
      if (error) throw error;

      toast.success("Peminjaman berhasil ditambahkan!");
      router.push("/transactions");
      router.refresh();
    } catch (error) {
      toast.error(error.message ?? "Terjadi kesalahan");
    }
  };

  const MEMBER_OPTIONS = memberList.map((member) => ({
    label: member.name,
    value: member.id,
  }));

  const BOOK_OPTIONS = bookList.map((book) => ({
    label: book.title,
    value: book.id,
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">Add Transaction</h1>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet className="w-full max-w-lg">
          <FieldGroup>
            {/* ── Peminjam ── */}
            <Controller
              name="member_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="member_id">Peminjam</FieldLabel>
                  <NewSelectComps
                    items={MEMBER_OPTIONS}
                    value={field.value ?? ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ── Tanggal Kembali ── */}
            <Controller
              name="due_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="due_date">Tanggal Kembali</FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          id="date-picker-simple"
                          className="justify-start font-normal w-full"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pilih tanggal
                            </span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex flex-col gap-4">
              <FieldLabel>Buku yang Dipinjam</FieldLabel>

              {fields.map((fieldItem, index) => (
                <BookRow
                  key={fieldItem.id}
                  index={index}
                  control={form.control}
                  bookList={BOOK_OPTIONS}
                  bookCopiesMap={bookCopiesMap}
                  getBookCopies={getBookCopies}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                  setValue={form.setValue}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-fit gap-2"
                onClick={() =>
                  append({ book_id: undefined, copy_id: undefined })
                }
              >
                <Plus className="w-4 h-4" />
                Tambah Buku
              </Button>

              {/* Top-level array error (e.g. min(1)) */}
              {form.formState.errors.books?.root && (
                <FieldError errors={[form.formState.errors.books.root]} />
              )}
            </div>

            {/* ── Actions ── */}
            <Field orientation="responsive" className="justify-end">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push("/transactions")}
              >
                Back
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

const BookRow = ({
  index,
  control,
  bookList,
  bookCopiesMap,
  getBookCopies,
  onRemove,
  canRemove,
  setValue,
}) => {
  return (
    <div className="flex gap-3 items-start border rounded-md p-3">
      <Controller
        name={`books.${index}.book_id`}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="flex-1">
            <FieldLabel>Judul Buku</FieldLabel>
            <NewSelectComps
              items={bookList}
              onValueChange={async (val) => {
                const bookId = Number(val);
                field.onChange(bookId);
                setValue(`books.${index}.copy_id`, undefined);
                await getBookCopies(bookId);
              }}
              value={field.value ?? ""}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Code Exemplar */}
      <Controller
        name={`books.${index}.copy_id`}
        control={control}
        render={({ field, fieldState }) => {
          // Watch the sibling book_id to determine which copies to show
          const watchedBookId = control._formValues?.books?.[index]?.book_id;
          const copies = bookCopiesMap[watchedBookId] ?? [];

          return (
            <Field className="flex-1">
              <FieldLabel>Exemplar</FieldLabel>
              <NewSelectComps
                items={copies.map((copy) => ({
                  label: copy.copy_code,
                  value: copy.id,
                }))}
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ?? ""}
                disabled={!watchedBookId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      {/* Remove row button */}
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-6 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default AddTransaction;
