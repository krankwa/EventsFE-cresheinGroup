import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaginationWrapperProps } from "@/interface/pagination";
import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";


export function PaginationWrapper({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationWrapperProps) {
  const [jumpValue, setJumpValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when it appears
  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  const handleJumpSubmit = () => {
    const page = parseInt(jumpValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
    setEditingIndex(null);
    setJumpValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJumpSubmit();
    } else if (e.key === "Escape") {
      setEditingIndex(null);
      setJumpValue("");
    }
  };
//   if (totalPages <= 1 && totalItems <= (pageSizeOptions || [10])[0]) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-muted/30">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground/80">
        <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-full border border-muted/30">
          <span className="font-medium">Show</span>
          <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-[70px] h-8 bg-background border-muted/50 rounded-full focus:ring-primary/20 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl overflow-hidden shadow-xl border-muted/30">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()} className="focus:bg-primary/5">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="font-medium">per page</span>
        </div>
        <div className="font-medium tracking-tight">
          Displaying <span className="text-foreground">{startItem}—{endItem}</span> <span className="opacity-60 text-[10px] mx-1">of</span> <span className="text-foreground font-bold">{totalItems}</span> items
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                editingIndex === index ? (
                  <div className="w-10">
                    <Input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={jumpValue}
                      onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={handleKeyDown}
                      onBlur={handleJumpSubmit}
                      className="h-8 p-1 text-center font-bold border-2 border-primary/40 focus-visible:ring-primary/20 rounded-lg animate-in fade-in zoom-in duration-200"
                      placeholder="#"
                    />
                  </div>
                ) : (
                  <PaginationEllipsis
                    className="cursor-pointer hover:bg-muted/50 rounded-full transition-colors group"
                    onClick={() => {
                      setEditingIndex(index);
                      setJumpValue("");
                    }}
                  />
                )
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page as number)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}