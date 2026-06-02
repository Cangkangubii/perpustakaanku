import DetailBookPage from "@/components/pageComponent/DetailBooksPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  const supabase = await createClient();
  const { data: detailBook, error } = await supabase.from("books").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching book details:", error);
    return <div>Error fetching book details.</div>;
  }

  return <DetailBookPage initialValues={detailBook} />;
};

export default page;
