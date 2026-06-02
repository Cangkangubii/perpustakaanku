import BooksPage from "@/components/pageComponent/BooksPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const { data: books } = await supabase.from("books").select();
  return <BooksPage data={books} />;
};

export default page;
