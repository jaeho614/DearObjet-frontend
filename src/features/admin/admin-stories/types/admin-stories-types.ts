export interface AdminStoryItem {
  storyId: number;
  title: string;
  userName: string;
  createdAt: string;
  blinded: boolean;
}

export interface AdminStoryListResponse {
  stories: AdminStoryItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export interface AdminStoryDetail {
  storyId: number;
  title: string;
  userName: string;
  createdAt: string;
  blinded: boolean;
  content: string;
  thumbnailImageUrl: string;
}
