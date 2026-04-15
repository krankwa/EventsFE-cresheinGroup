export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  searchQuery: string;
  totalItems: number;
  totalPages: number;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  goToPage: (page: number) => void;
  handleSearch: (query: string) => void;
  resetPagination: () => void;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
}
