import MembersPage from "@/components/pageComponent/MembersPage";
import { createClient } from "@/lib/server";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const { data: members } = await supabase.from("members").select();
  return <MembersPage data={members} />;
};

export default page;
