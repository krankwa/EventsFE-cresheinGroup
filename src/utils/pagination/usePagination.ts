import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const [config] = useState({
    initialPage: options.initialPage ?? 1,
    initialPageSize: options.initialPageSize ?? 10,
  });

  const [page, setPage] = useState(config.initialPage);
  const [pageSize, setPageSize] = useState(config.initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isDescending, setIsDescending] = useState(false);

  const resetPagination = useCallback(() => {
    setPage(config.initialPage);
  }, [config.initialPage]);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setPage(config.initialPage); // Reset to page 1 on new search
    },
    [config.initialPage],
  );

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setIsDescending(!isDescending);
      } else {
        setSortBy(field);
        setIsDescending(false);
      }
      setPage(config.initialPage); // Reset to page 1 on sort change
    },
    [sortBy, isDescending, config.initialPage],
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    searchQuery,
    totalItems,
    totalPages,
    sortBy,
    isDescending,
    setPageSize,
    setTotalItems,
    goToPage,
    handleSearch,
    handleSort,
    resetPagination,
  };
};
