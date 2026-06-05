import MembersPage from "@/components/pageComponent/MembersPage";
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

  let query = supabase.from("members").select("*", {
    count: "exact",
  });

  if (search) {
    query.ilike("name", `%${search}%`);
  }

  query = query.range(from, to);

  const { data: members, count, error } = await query;
  if (error) {
    console.error("Error fetching members:", error);
    return <div>Error loading members.</div>;
  }

  return (
    <MembersPage
      members={members}
      query={{
        page: currentPage,
        per_page: perPage,
        total: count ?? 0,
      }}
    />
  );
};

export default page;
