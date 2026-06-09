import BookCopyPage from "@/components/pageComponent/BooksCopyPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data: bookCopies, error } = await supabase
    .from("book_copies")
    .select(
      `
    id,
    copy_code,
    status,
    created_at
  `,
    )
    .eq("book_id", id);

  if (error) {
    console.error("Error fetching book details:", error);
    return <div>Error fetching book details.</div>;
  }


  return <BookCopyPage data={bookCopies} id={id} />;
};

export default page;
