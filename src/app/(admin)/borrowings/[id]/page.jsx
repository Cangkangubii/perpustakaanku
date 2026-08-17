import DetailTransactionPage from "@/components/pageComponent/DetailTransactionPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data: borrowing, error } = await supabase
    .from("borrowings")
    .select(
      `
      id,
      status,
      borrowed_at,
      due_date,
      members (
        id,
        name,
        phone
      ),
      borrowings_items (
        id,
        status,
        returned_at,
        book_copies (
          copy_code,
          books (
            title,
            author
          )
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching borrowing detail:", error);
    return <div>Error fetching borrowing detail.</div>;
  }

  return <DetailTransactionPage borrowing={borrowing} />;
};

export default page;
