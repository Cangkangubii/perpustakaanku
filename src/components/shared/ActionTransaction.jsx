"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

export default function BorrowingActionCell({
  record,
  onReturn,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      {/* Detail */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          router.push(`/borrowings/${record.id}`)
        }
      >
        Detail
      </Button>

      {/* Return */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={record.status === "returned"}
          className={buttonVariants({
            size: "sm",
            className: "h-8 px-3 cursor-pointer",
          })}
        >
          Return
        </PopoverTrigger>

        <PopoverContent align="start">
          <p className="text-sm font-medium mb-3">
            Yakin ingin mengembalikan buku ini?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Tidak
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onReturn?.(record.id);
                setOpen(false);
              }}
            >
              Ya, Return
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}