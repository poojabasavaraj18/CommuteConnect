import { Post } from './post';

export interface Pagination {

  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

}

export interface PostsResponse {

  data: Post[];

  pagination: Pagination;

}