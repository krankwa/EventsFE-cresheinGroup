import { useState, useCallback } from 'react';

interface UseServerPaginationProps {
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export function useServerPagination({ 
  initialPageSize = 10, 
  onPageChange 
}: UseServerPaginationProps = {}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const goToPage = useCallback((page: number) => {
    setPageNumber(page);
    onPageChange?.(page, pageSize);
  }, [pageSize, onPageChange]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1); // Reset to first page when changing page size
    onPageChange?.(1, newSize);
  }, [onPageChange]);

  const updatePaginationInfo = useCallback((response: { totalPages: number; totalCount: number }) => {
    setTotalPages(response.totalPages);
    setTotalCount(response.totalCount);
  }, []);

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