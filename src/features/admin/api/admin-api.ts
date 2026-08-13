import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery, type UserStatus } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';

import type {
  AdminRoleCountResponse,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserStatusResponse,
} from '../admin-members/types/admin-members-types';
import type { AdminPostListResponse } from '../admin-posts/types/admin-post-types';
import type { PostDetail } from '../../post/types/post-type';
import type {
  NoticeCreateRequest,
  NoticeItem,
  NoticeListResponse,
  NoticeUpdateRequest,
} from '../admin-notices/types/admin-notices-types';
import type {
  AdminClassDetail,
  AdminClassListResponse,
} from '../admin-classes/types/admin-classes-types';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: createBaseQuery(),
  tagTypes: [
    'AdminPost',
    'AdminNotice',
    'AdminMember',
    'AdminStory',
    'AdminClass',
    'AdminArtist',
  ],
  endpoints: (builder) => ({
    getAdminRoleCounts: builder.query<AdminRoleCountResponse, void>({
      query: () => '/api/v1/admin/users/role-counts',
      transformResponse: (res: ApiResponse<AdminRoleCountResponse>) => res.data,
      providesTags: ['AdminMember'],
    }),

    getAdminUsers: builder.query<
      AdminUserListResponse,
      { page: number; role?: string; keyword?: string }
    >({
      query: ({ page, role, keyword }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (role) params.set('role', role);
        if (keyword) params.set('keyword', keyword);
        return `/api/v1/admin/users?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<AdminUserListResponse>) => res.data,
      providesTags: ['AdminMember'],
    }),

    getAdminUser: builder.query<AdminUserDetailResponse, number>({
      query: (userId) => `/api/v1/admin/users/${userId}`,
      transformResponse: (res: ApiResponse<AdminUserDetailResponse>) =>
        res.data,
      providesTags: (result, error, userId) => [
        { type: 'AdminMember', id: userId },
      ], // 추가
    }),

    updateUserStatus: builder.mutation<
      AdminUserStatusResponse,
      { userId: number; status: UserStatus }
    >({
      query: ({ userId, status }) => ({
        url: `/api/v1/admin/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: ApiResponse<AdminUserStatusResponse>) =>
        res.data,
      invalidatesTags: (result, error, { userId }) => [
        { type: 'AdminMember', id: userId }, // 특정 유저 상세 캐시 무효화
        'AdminMember', // 목록도 함께 무효화
      ],
    }),

    getAdminPosts: builder.query<
      AdminPostListResponse,
      { page: number; keyword?: string }
    >({
      query: ({ page, keyword }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (keyword) params.set('keyword', keyword);
        return `/api/v1/admin/posts?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<AdminPostListResponse>) => res.data,
      providesTags: ['AdminPost'],
    }),

    getAdminPost: builder.query<PostDetail, number>({
      query: (postId) => `/api/v1/admin/posts/${postId}`,
      transformResponse: (res: ApiResponse<PostDetail>) => res.data,
    }),

    updatePostBlinded: builder.mutation<
      PostDetail,
      { postId: number; blinded: boolean }
    >({
      query: ({ postId, blinded }) => ({
        url: `/api/v1/admin/posts/${postId}/blind?blinded=${blinded}`,
        method: 'PATCH',
      }),
      transformResponse: (res: ApiResponse<PostDetail>) => res.data,
      invalidatesTags: ['AdminPost'],
    }),

    deleteAdminPost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/api/v1/admin/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminPost'],
    }),

    getAdminNotices: builder.query<
      NoticeListResponse,
      {
        target?: string;
        category?: string;
        keyword?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({ target, category, keyword, page = 1, size = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (target) params.set('target', target);
        if (category) params.set('category', category);
        if (keyword) params.set('keyword', keyword);
        return `/api/v1/admin/notices?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<NoticeListResponse>) => res.data,
      providesTags: ['AdminNotice'],
    }),

    getAdminNotice: builder.query<NoticeItem, number>({
      query: (noticeId) => `/api/v1/admin/notices/${noticeId}`,
      transformResponse: (res: ApiResponse<NoticeItem>) => res.data,
      providesTags: (result, error, noticeId) => [
        { type: 'AdminNotice', id: noticeId },
      ],
    }),

    createAdminNotice: builder.mutation<NoticeItem, NoticeCreateRequest>({
      query: (body) => ({
        url: '/api/v1/admin/notices',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<NoticeItem>) => res.data,
      invalidatesTags: ['AdminNotice'],
    }),

    updateAdminNotice: builder.mutation<
      NoticeItem,
      { noticeId: number; body: NoticeUpdateRequest }
    >({
      query: ({ noticeId, body }) => ({
        url: `/api/v1/admin/notices/${noticeId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: ApiResponse<NoticeItem>) => res.data,
      invalidatesTags: (result, error, { noticeId }) => [
        { type: 'AdminNotice', id: noticeId },
        'AdminNotice',
      ],
    }),

    deleteAdminNotice: builder.mutation<void, number>({
      query: (noticeId) => ({
        url: `/api/v1/admin/notices/${noticeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminNotice'],
    }),

    getAdminClasses: builder.query<
      AdminClassListResponse,
      { page: number; keyword?: string }
    >({
      query: ({ page, keyword }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (keyword) params.set('keyword', keyword);
        return `/api/v1/admin/classes?${params.toString()}`;
      },
      transformResponse: (res: ApiResponse<AdminClassListResponse>) => res.data,
      providesTags: ['AdminClass'],
    }),

    getAdminClass: builder.query<AdminClassDetail, number>({
      query: (classId) => `/api/v1/admin/classes/${classId}`,
      transformResponse: (res: ApiResponse<AdminClassDetail>) => res.data,
      providesTags: (result, error, classId) => [
        { type: 'AdminClass', id: classId },
      ],
    }),

    updateClassBlinded: builder.mutation<
      AdminClassDetail,
      { classId: number; blinded: boolean }
    >({
      query: ({ classId, blinded }) => ({
        url: `/api/v1/admin/classes/${classId}/blind`,
        method: 'PATCH',
        body: { blinded },
      }),
      transformResponse: (res: ApiResponse<AdminClassDetail>) => res.data,
      invalidatesTags: (result, error, { classId }) => [
        { type: 'AdminClass', id: classId },
        'AdminClass',
      ],
    }),

    deleteAdminClass: builder.mutation<void, number>({
      query: (classId) => ({
        url: `/api/v1/admin/classes/${classId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminClass'],
    }),
  }),
});

export const {
  useGetAdminRoleCountsQuery,
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateUserStatusMutation,
  useGetAdminPostsQuery,
  useGetAdminPostQuery,
  useUpdatePostBlindedMutation,
  useDeleteAdminPostMutation,
  useGetAdminNoticesQuery,
  useGetAdminNoticeQuery,
  useCreateAdminNoticeMutation,
  useUpdateAdminNoticeMutation,
  useDeleteAdminNoticeMutation,
  useGetAdminClassesQuery,
  useGetAdminClassQuery,
  useUpdateClassBlindedMutation,
  useDeleteAdminClassMutation,
} = adminApi;
