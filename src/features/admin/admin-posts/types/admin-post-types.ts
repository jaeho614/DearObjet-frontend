export interface AdminPostItem {
  postId: number;
  preview: string;
  authorName: string;
  createdAt: string;
  blinded: boolean;
}

export interface AdminPostListResponse {
  items: AdminPostItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}
