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
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama minimal 2 karakter." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama hanya boleh mengandung huruf dan spasi.",
    }),
  phone: z
    .string()
    .min(10, { message: "Nomor HP minimal 10 digit." })
    .max(13, { message: "Nomor HP maksimal 13 digit." })
    .regex(/^(08|628)\d{8,10}$/, {
      message:
        "Format nomor HP tidak valid (harus diawali 08 atau 628 dan berupa angka).",
    }),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Pilih status yang valid." }),
  }),
});


const AddMemberPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      status: "active",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.from("members").insert(data);
      if (error) {
        toast.error("Gagal menambahkan member.", { position: "top-center" });
      } else {
        toast.success("Member berhasil ditambahkan!", {
          position: "top-center",
        });
        router.push("/members");
      }
    } catch (error) {
      toast.error("Gagal menambahkan member.", { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1>Add Members</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FieldSet className="w-full max-w-md">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Nama</FieldLabel>
                  <Input
                    id="name"
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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="phone">No Hp</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="081234567890"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field orientation="responsive" className="justify-end">
              <Button variant="outline">
                <Link href="/members">Back</Link>
              </Button>
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default AddMemberPage;
