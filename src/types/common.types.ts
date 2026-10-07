export type APIResponse<T> = {
  data: T;
  status: number;
  statusMessage: string;
};

export type PaginatedAPIResponse<T> = {
  data: T;
  status: number;
  statusMessage: string;
  meta: {
    page: number;
    total: number;
    size: number;
  };
};
