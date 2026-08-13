export interface AdminClassItem {
  classId: number;
  className: string;
  shopName: string;
  createdAt: string;
  blinded: boolean;
}

export interface AdminClassListResponse {
  classes: AdminClassItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export interface AdminClassDetail {
  classId: number;
  className: string;
  shopName: string;
  createdAt: string;
  blinded: boolean;
  classDescription: string;
  classImageUrls: string[];
  price: number;
  maxCapacity: number;
  notes: string | null;
}
