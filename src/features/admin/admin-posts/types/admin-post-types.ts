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

export interface ContentItem {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  status: 'VISIBLE' | 'BLIND';
  content?: string;
  imageUrl?: string;
}

export interface ContentManagePanelProps {
  title: string;
  items: ContentItem[];
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onBlind: (id: number) => void;
  onUnblind: (id: number) => void;
}
