export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export const paginate = (query: Record<string, any>): PaginationResult => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 20));
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
};
