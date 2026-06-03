import AddTransaction from "@/components/pageComponent/AddTransaction";
import { createClient } from "@/lib/server";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const [
    { data: bookList, error: bookListError },
    { data: memberList, error: memberListError },
  ] = await Promise.all([
    supabase.from("books").select("*"),
    supabase.from("members").select("*"),
  ]);

  if (bookListError) throw bookListError;
  if (memberListError) throw memberListError;

  return <AddTransaction bookList={bookList} memberList={memberList} />;
};

export default page;
