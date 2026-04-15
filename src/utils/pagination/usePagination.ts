import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(initialPage); // Reset to page 1 on new search
  }, [initialPage]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    searchQuery,
    totalItems,
    totalPages,
    setPageSize,
    setTotalItems,
    goToPage,
    handleSearch,
    resetPagination,
  };
};