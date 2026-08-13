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
} = adminApi;
