export interface PaginatedResponse<T> {
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: T[];
}

export interface ApiResponseWrapper<T> {
  statusCode: string;
  message: string;
  data: T;
}

export interface ApiErrorResponse{
  statusCode: string;
  message: string;
  detail: string;
}

// Params for pagination, can be extended for filtering and sorting as needed
export interface PageinationParams {
  PageIndex?: number;
  PageSize?: number;
}