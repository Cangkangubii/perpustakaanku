import DetailMembersPage from "@/components/pageComponent/DetailMembersPage";
import { createClient } from "@/lib/server";
import React from "react";
const page = async ({ params }) => {
  const supabase = await createClient();
  const { id } = await params;
  const { data: detailMembers } = await supabase
    .from("members")
    .select()
    .eq("id", id)
    .single();

  return <DetailMembersPage initialValues={detailMembers} />;
};

export default page;
