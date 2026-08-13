import { useNavigate } from 'react-router';
import { X } from 'lucide-react';

import { ROUTES, type UserStatus } from '../../../../shared/constants';

import {
  useGetAdminUserQuery,
  useUpdateUserStatusMutation,
} from '../../api/admin-api';
import {
  ROLE_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from '../constants/admin-members-constants';
import { InfoRow } from './info-row';

export const MemberDetailModal = ({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { data: member, isLoading } = useGetAdminUserQuery(userId);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleNavigate = (route: string) => {
    onClose();
    navigate(route, { state: { searchKeyword: member?.name } });
  };

  const handleStatusToggle = async () => {
    if (!member) return;
    const isActive = member.status === 'ACTIVE';
    const nextStatus: UserStatus = isActive ? 'INACTIVE' : 'ACTIVE';
    const label = isActive ? '비활성화' : '활성화';
    if (!confirm(`해당 회원을 ${label}하시겠습니까?`)) return;
    try {
      await updateUserStatus({
        userId: member.userId,
        status: nextStatus,
      }).unwrap();
      onClose();
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const isWithdrawalPending = member?.status === 'WITHDRAWAL_PENDING';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[80vh] w-[36rem] flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <h2 className="font-bold">회원 상세 정보</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </header>

        {/* 바디 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading || !member ? (
            <p className="py-10 text-center text-sm text-gray-400">
              불러오는 중...
            </p>
          ) : (
            <>
              {/* 프로필 */}
              <div className="mb-5 flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {member.profileUrl ? (
                    <img
                      src={member.profileUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-gray-400">
                      {member.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${ROLE_STYLE[member.role]}`}
                    >
                      {member.role}
                    </span>
                    <span className={`text-xs ${STATUS_STYLE[member.status]}`}>
                      {STATUS_LABEL[member.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">{member.email}</p>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="mb-4 rounded-lg bg-gray-50 px-4 py-2">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  기본 정보
                </p>
                <InfoRow label="user_id" value={member.userId} />
                <InfoRow label="phone_number" value={member.phoneNumber} />
                <InfoRow label="social_id" value={member.socialId} />
                <InfoRow
                  label="marketing_agreement"
                  value={member.marketingAgreement ? '동의' : '미동의'}
                />
                <InfoRow
                  label="sms_agreement"
                  value={member.smsAgreement ? '동의' : '미동의'}
                />
                <InfoRow
                  label="created_at"
                  value={new Date(member.createdAt).toLocaleDateString('ko-KR')}
                />
                <InfoRow
                  label="updated_at"
                  value={new Date(member.updatedAt).toLocaleDateString('ko-KR')}
                />
                <InfoRow
                  label="withdrawal_requested_at"
                  value={
                    member.withdrawalRequestedAt
                      ? new Date(
                          member.withdrawalRequestedAt
                        ).toLocaleDateString('ko-KR')
                      : '-'
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* 푸터 */}
        {member && (
          <footer className="shrink-0 border-t px-6 py-4">
            {/* 상태 변경 버튼 */}
            <div className="mb-3 flex items-center gap-2">
              {member.status === 'WITHDRAWN' ? null : isWithdrawalPending ? (
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className="rounded-md border border-amber-100 px-3 py-1.5 text-xs text-amber-500 hover:bg-amber-50"
                >
                  탈퇴 취소
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`rounded-md border px-3 py-1.5 text-xs ${
                    member.status === 'ACTIVE'
                      ? 'border-red-100 text-red-400 hover:bg-red-50'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {member.status === 'ACTIVE' ? '비활성화' : '활성화'}
                </button>
              )}
            </div>

            {/* 관련 콘텐츠 바로가기 */}
            <p className="mb-2 text-xs text-gray-400">관련 콘텐츠 바로가기</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleNavigate(ROUTES.ADMIN_POSTS)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                포스트 보기
              </button>
              {member.role === 'SHOP' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleNavigate(ROUTES.ADMIN_STORIES)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    스토리 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate(ROUTES.ADMIN_CLASSES)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    클래스 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate(ROUTES.ADMIN_MAP)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    소품샵 위치 보기
                  </button>
                </>
              )}
              {member.role === 'ARTIST' && (
                <button
                  type="button"
                  onClick={() => handleNavigate(ROUTES.ADMIN_ARTISTS)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  작가 보기
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
