import { useState, useCallback } from "react";

interface UseServerPaginationOptions {
  initialPageSize?: number;
  initialPage?: number;
  onPageChange?: (page: number, size: number) => void;
}

export function useServerPagination({
  initialPageSize = 10,
  initialPage = 1,
  onPageChange,
}: UseServerPaginationOptions = {}) {
  // --- State ---
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- Handlers ---
  const goToPage = useCallback(
    (page: number) => {
      setPageNumber(page);
      if (onPageChange) {
        onPageChange(page, pageSize);
      }
    },
    [pageSize, onPageChange],
  );

  const changePageSize = useCallback(
    (size: number) => {
      setPageSize(size);
      setPageNumber(1); // Always reset to page 1 when changing page sizes
      if (onPageChange) {
        onPageChange(1, size);
      }
    },
    [onPageChange],
  );

  // THIS IS THE MISSING FUNCTION
  const updatePaginationInfo = useCallback(
    ({
      totalPages: newTotalPages,
      totalCount: newTotalCount,
    }: {
      totalPages: number;
      totalCount: number;
    }) => {
      setTotalPages(newTotalPages);
      setTotalCount(newTotalCount);
    },
    [],
  );

  return {
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    goToPage,
    changePageSize,
    updatePaginationInfo,
  };
}
