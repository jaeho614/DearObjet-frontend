import { Button } from '../../../../shared/components/ui';

import { useGetAdminPostQuery } from '../../api/admin-api';
import {
  POST_STATUS_LABEL,
  POST_STATUS_STYLE,
} from '../constants/admin-posts-constants';

export const AdminPostDetail = ({
  postId,
  onBlind,
  onUnblind,
  onDelete,
  isBlinded,
}: {
  postId: number;
  isBlinded: boolean;
  onBlind: () => void;
  onUnblind: () => void;
  onDelete: () => void;
}) => {
  const { data: post, isLoading } = useGetAdminPostQuery(postId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        포스트를 불러올 수 없습니다.
      </div>
    );
  }

  const status = isBlinded ? 'BLIND' : 'VISIBLE';

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-3">
        <h2 className="font-bold">상세 보기</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondaryLight"
            size="small"
            label={isBlinded ? '블라인드 해제' : '블라인드'}
            onClick={isBlinded ? onUnblind : onBlind}
          />
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* 상태 배지 */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${POST_STATUS_STYLE[status]}`}
          >
            {POST_STATUS_LABEL[status]}
          </span>
        </div>

        {/* 작성자 + 날짜 */}
        <p className="mb-4 text-xs text-gray-400">
          {post.userName} ·{' '}
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </p>

        {/* 이미지 */}
        {post.imageUrls.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={post.imageUrls[0]}
              alt="포스트 이미지"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 내용 */}
        <div className="whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
          {post.content}
        </div>
      </div>
    </>
  );
};
