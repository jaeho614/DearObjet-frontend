import { type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';

import { ADMIN_ROUTES } from '../constants/admin-constants';

type UserRole = 'CUSTOMER' | 'ARTIST' | 'SHOP' | 'TEMP' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface UserBase {
  userId: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  profileUrl: string | null;
  role: UserRole;
  socialId: string | null;
  userStatus: UserStatus;
  marketingAgreement: boolean;
  smsAgreement: boolean;
  createdAt: string;
  updatedAt: string;
  withdrawalRequestedAt: string | null;
}

interface ArtistProfile {
  artistsId: number;
  businessProfileId: number | null;
  userId: number;
  instagramId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ShopProfile {
  shopId: number;
  shopName: string;
  shopDescription: string | null;
  businessProfileId: number | null;
  userId: number;
  instagramId: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberDetail extends UserBase {
  artistProfile?: ArtistProfile;
  shopProfile?: ShopProfile;
}

interface MemberDetailModalProps {
  member: MemberDetail;
  onClose: () => void;
}

const ROLE_STYLE: Record<UserRole, string> = {
  CUSTOMER: 'bg-blue-50 text-blue-600',
  ARTIST: 'bg-purple-50 text-purple-600',
  SHOP: 'bg-emerald-50 text-emerald-600',
  TEMP: 'bg-gray-100 text-gray-500',
  ADMIN: 'bg-red-50 text-red-500',
};

const STATUS_STYLE: Record<UserStatus, string> = {
  ACTIVE: 'text-emerald-500',
  INACTIVE: 'text-gray-400',
  SUSPENDED: 'text-red-400',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 border-b border-gray-50 py-2 last:border-0">
    <span className="w-32 shrink-0 text-xs text-gray-400">{label}</span>
    <span className="text-xs text-gray-700">{value ?? '-'}</span>
  </div>
);

export const MemberDetailModal = ({
  member,
  onClose,
}: MemberDetailModalProps) => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    onClose();
    navigate(route, { state: { searchKeyword: member.name } });
  };

  return (
    // 배경 오버레이
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
                  {member.name[0]}
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
                <span className={`text-xs ${STATUS_STYLE[member.userStatus]}`}>
                  {STATUS_LABEL[member.userStatus]}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400">{member.email}</p>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="mb-4 rounded-lg bg-gray-50 px-4 py-2">
            <p className="mb-2 text-xs font-medium text-gray-500">기본 정보</p>
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
            <InfoRow label="created_at" value={member.createdAt} />
            <InfoRow label="updated_at" value={member.updatedAt} />
            <InfoRow
              label="withdrawal_requested_at"
              value={member.withdrawalRequestedAt ?? '-'}
            />
          </div>

          {/* ARTIST 추가 정보 */}
          {member.role === 'ARTIST' && member.artistProfile && (
            <div className="mb-4 rounded-lg bg-purple-50 px-4 py-2">
              <p className="mb-2 text-xs font-medium text-purple-500">
                작가 프로필
              </p>
              <InfoRow
                label="artists_id"
                value={member.artistProfile.artistsId}
              />
              <InfoRow
                label="business_profile_id"
                value={member.artistProfile.businessProfileId}
              />
              <InfoRow
                label="instagram_id"
                value={member.artistProfile.instagramId}
              />
              <InfoRow
                label="created_at"
                value={member.artistProfile.createdAt}
              />
              <InfoRow
                label="updated_at"
                value={member.artistProfile.updatedAt}
              />
            </div>
          )}

          {/* SHOP 추가 정보 */}
          {member.role === 'SHOP' && member.shopProfile && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2">
              <p className="mb-2 text-xs font-medium text-emerald-600">
                소품샵 프로필
              </p>
              <InfoRow label="shop_id" value={member.shopProfile.shopId} />
              <InfoRow label="shop_name" value={member.shopProfile.shopName} />
              <InfoRow
                label="shop_description"
                value={member.shopProfile.shopDescription}
              />
              <InfoRow
                label="business_profile_id"
                value={member.shopProfile.businessProfileId}
              />
              <InfoRow
                label="instagram_id"
                value={member.shopProfile.instagramId}
              />
              <InfoRow label="latitude" value={member.shopProfile.latitude} />
              <InfoRow label="longitude" value={member.shopProfile.longitude} />
              <InfoRow
                label="created_at"
                value={member.shopProfile.createdAt}
              />
              <InfoRow
                label="updated_at"
                value={member.shopProfile.updatedAt}
              />
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <footer className="shrink-0 border-t px-6 py-4">
          <p className="mb-2 text-xs text-gray-400">관련 콘텐츠 바로가기</p>
          <div className="flex flex-wrap gap-2">
            {/* 공통: 포스트 보기 */}
            <button
              type="button"
              onClick={() => handleNavigate(ADMIN_ROUTES.POSTS)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              포스트 보기
            </button>

            {/* SHOP 전용 */}
            {member.role === 'SHOP' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate(ADMIN_ROUTES.STORIES)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  스토리 보기
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate(ADMIN_ROUTES.CLASSES)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  클래스 보기
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate(ADMIN_ROUTES.MAP)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  소품샵 위치 보기
                </button>
              </>
            )}

            {/* ARTIST 전용 */}
            {member.role === 'ARTIST' && (
              <button
                type="button"
                onClick={() => handleNavigate(ADMIN_ROUTES.ARTISTS)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                작가 보기
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
