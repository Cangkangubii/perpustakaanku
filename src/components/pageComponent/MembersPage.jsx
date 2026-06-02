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
import { useRouter } from "next/navigation";
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

const MembersPage = ({ data = [] }) => {
  const router = useRouter();
  const supabase = createClient();
  const [openId, setOpenId] = useState(null);
  const handleDelete = async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      console.error("Error deleting member:", error);
    } else {
      toast.success("Member deleted successfully");
      router.refresh();
    }
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Members</h1>
      <div className="flex justify-between w-full">
        <div></div>
        <Button onClick={() => router.push("/members/add")}>Add Member</Button>
      </div>
      <Table>
        <TableCaption>A list of your members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>No Hp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((member, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/members/details/${member.id}`)}
                  className="cursor-pointer"
                >
                  Details
                </Button>
                <Popover
                  open={openId === member.id}
                  onOpenChange={(open) => {
                    setOpenId(open ? member.id : null);
                  }}
                >
                  <PopoverTrigger
                    className={buttonVariants({
                      variant: "destructive",
                      size: "sm",
                      className: "h-8 px-3 cursor-pointer",
                    })}
                  >
                    Delete
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <PopoverHeader>
                      <PopoverTitle>
                        Yakin ingin menghapus data ini?
                      </PopoverTitle>
                    </PopoverHeader>
                    <div className="space-y-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => setOpenId(null)}
                        >
                          Tidak
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            handleDelete(member.id);
                            setOpenId(null);
                          }}
                          className="h-8 px-3 text-xs"
                        >
                          Ya, Hapus
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersPage;
