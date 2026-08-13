import { Button } from '../../../../shared/components/ui';

import { useGetAdminClassQuery } from '../../api/admin-api';
import {
  CLASS_STATUS_LABEL,
  CLASS_STATUS_STYLE,
} from '../constants/admin-classes-constants';

export const AdminClassDetail = ({
  classId,
  isBlinded,
  onBlind,
  onUnblind,
  onDelete,
}: {
  classId: number;
  isBlinded: boolean;
  onBlind: () => void;
  onUnblind: () => void;
  onDelete: () => void;
}) => {
  const { data: classDetail, isLoading } = useGetAdminClassQuery(classId);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
        클래스를 불러올 수 없습니다.
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
            className={`rounded-full px-2 py-0.5 text-[10px] ${CLASS_STATUS_STYLE[status]}`}
          >
            {CLASS_STATUS_LABEL[status]}
          </span>
        </div>

        {/* 클래스명 */}
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          {classDetail.className}
        </h3>

        {/* 공방명 + 날짜 */}
        <p className="mb-4 text-xs text-gray-400">
          {classDetail.shopName} ·{' '}
          {new Date(classDetail.createdAt).toLocaleDateString('ko-KR')}
        </p>

        {/* 이미지 */}
        {classDetail.classImageUrls.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={classDetail.classImageUrls[0]}
              alt="클래스 이미지"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 클래스 정보 */}
        <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-gray-400">가격</span>
              <span className="text-xs text-gray-700">
                {classDetail.price.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-gray-400">
                최대 인원
              </span>
              <span className="text-xs text-gray-700">
                {classDetail.maxCapacity}명
              </span>
            </div>
            {classDetail.notes && (
              <div className="flex items-start gap-3">
                <span className="w-20 shrink-0 text-xs text-gray-400">
                  비고
                </span>
                <span className="text-xs text-gray-700">
                  {classDetail.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
          {classDetail.classDescription}
        </div>
      </div>
    </>
  );
};
