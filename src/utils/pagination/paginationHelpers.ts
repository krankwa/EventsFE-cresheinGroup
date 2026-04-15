import type { PaginationParams, PaginatedResponse } from "./paginationTypes";

/**
 * Calculate pagination metadata
 */
export const calculatePaginationMetadata = (
  totalItems: number,
  pageSize: number,
  currentPage: number,
) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    totalPages,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,
    itemsOnPage: endIndex - startIndex,
  };
};

/**
 * Slice data for current page (client-side pagination)
 */
export const paginateData = <T>(
  data: T[],
  page: number,
  pageSize: number,
): T[] => {
  const { startIndex, endIndex } = calculatePaginationMetadata(
    data.length,
    pageSize,
    page,
  );
  return data.slice(startIndex, endIndex);
};

/**
 * Filter data by search query
 */
export const filterBySearch = <T extends Record<string, unknown>>(
  data: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
): T[] => {
  if (!searchQuery.trim()) return data;

  const query = searchQuery.toLowerCase();
  return data.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(query),
    ),
  );
};

/**
 * Combine filtering and pagination
 */
export const filterAndPaginate = <T extends Record<string, unknown>>(
  data: T[],
  params: PaginationParams,
  searchFields: (keyof T)[],
): PaginatedResponse<T> => {
  const filtered = filterBySearch(data, params.search || "", searchFields);
  const paginated = paginateData(filtered, params.page, params.pageSize);
  const metadata = calculatePaginationMetadata(
    filtered.length,
    params.pageSize,
    params.page,
  );

  return {
    data: paginated,
    totalItems: filtered.length,
    totalPages: metadata.totalPages,
    currentPage: params.page,
    pageSize: params.pageSize,
  };
};

/**
 * Build query params string for API calls
 */
export const buildPaginationQuery = (params: PaginationParams): string => {
  const query = new URLSearchParams();
  query.append("page", params.page.toString());
  query.append("pageSize", params.pageSize.toString());
  if (params.search) query.append("search", params.search);
  return query.toString();
};
