import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../../shared/constants';
import type { ApiResponse } from '../../../shared/types';
import type { PostDetail } from '../../post/types/post-type';
import type { AdminPostListResponse } from '../admin-posts/types/admin-post-types';

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
  useGetAdminPostsQuery,
  useGetAdminPostQuery,
  useUpdatePostBlindedMutation,
  useDeleteAdminPostMutation,
} = adminApi;
