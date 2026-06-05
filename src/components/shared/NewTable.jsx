"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const NewDataTable = ({
  dataSource = [],
  columns = [],
  rowKey = "id",
  onRowClick,
  query = {
    page: 1,
    per_page: 10,
    total: 0,
  },
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(query.total / query.per_page);

  const updateQuery = (values) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <Table>
        {dataSource.length === 0 && (
          <TableCaption>No data available</TableCaption>
        )}

        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {dataSource.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            dataSource.map((item, rowIndex) => (
              <TableRow
                key={item[rowKey]}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(
                          item[column.dataIndex],
                          item,
                          rowIndex
                        )
                      : item[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <Select
          value={String(query.per_page)}
          onValueChange={(value) =>
            updateQuery({
              page: 1,
              per_page: value,
            })
          }
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  if (query.page > 1) {
                    updateQuery({
                      page: query.page - 1,
                    });
                  }
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 text-sm">
                Page {query.page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  if (query.page < totalPages) {
                    updateQuery({
                      page: query.page + 1,
                    });
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default NewDataTable;