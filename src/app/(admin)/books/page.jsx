import BooksPage from "@/components/pageComponent/BooksPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async ({ searchParams }) => {
  const supabase = await createClient();
  const params = await searchParams;
  const search = params.search ?? "";
  const currentPage = Number(params.page ?? 1);
  const perPage = Number(params.per_page ?? 10);

  const from = (currentPage - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabase.from("books").select("*", {
    count: "exact",
  });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,publisher.ilike.%${search}%`,
    );
  }

  query = query.range(from, to);

  const { data: books, count, error } = await query;

  if (error) {
    console.error(error);
    return <div>Error fetching books</div>;
  }
  return (
    <BooksPage
      books={books}
      query={{
        page: currentPage,
        per_page: perPage,
        total: count ?? 0,
      }}
    />
  );
};

export default page;
