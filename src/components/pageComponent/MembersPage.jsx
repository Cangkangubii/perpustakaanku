"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import PageHeader from "../shared/PageHeader";
import NewDataTable from "../shared/NewTable";
import ActionCell from "../shared/ActionCell";

const MembersPage = ({ members = [], query = {} }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      console.error("Error deleting member:", error);
    } else {
      toast.success("Member deleted successfully");
      router.refresh();
    }
  };
  const form = useForm();

  const onSubmit = ({ search }) => {
    search
      ? router.push(`/members?search=${encodeURIComponent(search)}`)
      : router.push("/members");
  };
  const columns = [
    {
      key: "no",
      title: "No",
      dataIndex: "no",
      render: (value, record, index) => index + 1,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      render: (value, record) => (
        <ActionCell
          record={record}
          detailPath="/members/details"
          onDelete={handleDelete}
          deleteDisabled={record.status === "inactive"}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col space-y-2">
      <PageHeader title="Members" addHref="/members/add" addLabel="Add Member">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <Input
            {...form.register("search")}
            placeholder="Search members..."
            className="w-72"
          />

          <Button type="submit" size="icon-sm">
            <SearchIcon />
          </Button>
        </form>
      </PageHeader>
      <NewDataTable columns={columns} dataSource={members} query={query} />
    </div>
  );
};

export default MembersPage;
