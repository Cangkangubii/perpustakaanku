import TransactionPage from "@/components/pageComponent/TransactionPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const { data: borrowingItems, error } = await supabase.from("borrowing_items")
    .select(`
    id,
    status,
    returned_at,

    borrowing_id,
    bookCopies (
      copy_code,
      books (
        title
      )
    ),

    borrowings (
      borrowed_at,
      due_date,
      members (
        name
      )
    )
  `);

  const borrowList = borrowingItems.map((item) => ({
    id: item.id,
    status: item.status,
    returned_at: item.returned_at,
    borrowed_at: item.borrowings.borrowed_at,
    due_date: item.borrowings.due_date,
    copy_code: item.bookCopies.copy_code,
    book_title: item.bookCopies.books.title,
    member_name: item.borrowings.members.name,
  }));

  if (error) {
    console.error("Error fetching transactions:", error);
    return <div>Error fetching transactions</div>;
  }
  return <TransactionPage data={borrowList} />;
};

export default page;
