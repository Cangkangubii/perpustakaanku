import TransactionPage from "@/components/pageComponent/TransactionPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async ({ searchParams }) => {
  const supabase = await createClient();
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const perPage = Number(params.per_page ?? 10);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const {
    data: borrowingItems,
    error,
    count,
  } = await supabase
    .from("borrowings_items")
    .select(
      `
      id,
      status,
      returned_at,

      borrowing_id,

      book_copies (
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
    `,
      { count: "exact" },
    )
    .range(from, to);

  if (error) {
    console.error("Error fetching transactions:", error);
    return <div>Error fetching transactions</div>;
  }

  function getBorrowingStatus(item) {
    if (item.status === "returned") return "returned";

    if (new Date(item.borrowings.due_date) < new Date()) {
      return "overdue";
    }

    return "borrowed";
  }

  const borrowList = (borrowingItems ?? []).map((item) => ({
    id: item.id,
    borrowing_id: item.borrowing_id,
    status: getBorrowingStatus(item),
    returned_at: item.returned_at,
    borrowed_at: item.borrowings.borrowed_at,
    due_date: item.borrowings.due_date,
    copy_code: item.book_copies.copy_code,
    book_title: item.book_copies.books.title,
    member_name: item.borrowings.members.name,
  }));
  return (
    <TransactionPage
      dataSource={borrowList}
      query={{
        page,
        per_page: perPage,
        total: count ?? 0,
      }}
    />
  );
};

export default page;
