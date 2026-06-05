"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ActionCell({
  record,
  onDelete,
  detailPath,
  deleteDisabled = false,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Detail Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`${detailPath}/${record.id}`)}
      >
        Detail
      </Button>

      {/* Delete Popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={deleteDisabled}
          className={buttonVariants({
            size: "sm",
            variant: "destructive",
            className: "h-8 px-3 cursor-pointer",
          })}
        >
          Delete
        </PopoverTrigger>

        <PopoverContent align="start" className="w-64">
          <p className="text-sm font-medium mb-3">
            Yakin ingin menghapus data ini?
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete?.(record.id);
                setOpen(false);
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
