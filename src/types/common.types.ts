export type APIResponse<T> = {
  data: T;
  status: number;
  statusMessage: string;
};
