import { Button } from '../../../../shared/components/ui';

import { useGetAdminStoryQuery } from '../../api/admin-api';
import {
  CONTENT_STATUS_LABEL,
  CONTENT_STATUS_STYLE,
} from '../constants/admin-stories-constants';

export const AdminStoryDetail = ({
  storyId,
  isBlinded,
  onBlind,
  onUnblind,
  onDelete,
}: {
  storyId: number;
  isBlinded: boolean;
  onBlind: () => void;
  onUnblind: () => void;
  onDelete: () => void;
}) => {
  const { data: story, isLoading } = useGetAdminStoryQuery(storyId);
  console.log(story?.userName);
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        스토리를 불러올 수 없습니다.
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
            className={`rounded-full px-2 py-0.5 text-[10px] ${CONTENT_STATUS_STYLE[status]}`}
          >
            {CONTENT_STATUS_LABEL[status]}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          {story.title}
        </h3>

        {/* 공방명 + 날짜 */}
        <p className="mb-4 text-xs text-gray-400">
          {story.userName} ·{' '}
          {new Date(story.createdAt).toLocaleDateString('ko-KR')}
        </p>

        {/* 이미지 */}
        {story.thumbnailImageUrl.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={story.thumbnailImageUrl}
              alt="스토리 이미지"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 내용 */}
        <div className="whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
          {story.content}
        </div>
      </div>
    </>
  );
};
