import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../shared/components/ui';
import {
  MemberDetailModal,
  type MemberDetail,
} from '../components/member-detail-modal';

const MOCK_MEMBERS: MemberDetail[] = [
  {
    userId: 1,
    name: '김지수',
    email: 'jisoo@gmail.com',
    role: 'CUSTOMER',
    phoneNumber: '010-1234-5678',
    profileUrl: null,
    socialId: 'kakao_123',
    userStatus: 'ACTIVE',
    marketingAgreement: true,
    smsAgreement: false,
    createdAt: '2025.08.30',
    updatedAt: '2025.08.30',
    withdrawalRequestedAt: null,
  },
  {
    userId: 2,
    name: '이도윤',
    email: 'dylee@naver.com',
    role: 'ARTIST',
    phoneNumber: '010-9876-5432',
    profileUrl: null,
    socialId: 'kakao_456',
    userStatus: 'ACTIVE',
    marketingAgreement: false,
    smsAgreement: false,
    createdAt: '2025.08.29',
    updatedAt: '2025.08.29',
    withdrawalRequestedAt: null,
    artistProfile: {
      artistsId: 1,
      businessProfileId: 10,
      userId: 2,
      instagramId: '@dylee_art',
      createdAt: '2025.08.29',
      updatedAt: '2025.08.29',
    },
  },
  {
    userId: 3,
    name: '솜다람잡화점',
    email: 'somdaram@shop.com',
    role: 'SHOP',
    phoneNumber: '010-5555-1234',
    profileUrl: null,
    socialId: 'kakao_789',
    userStatus: 'ACTIVE',
    marketingAgreement: true,
    smsAgreement: true,
    createdAt: '2025.08.28',
    updatedAt: '2025.08.28',
    withdrawalRequestedAt: null,
    shopProfile: {
      shopId: 1,
      shopName: '솜다람잡화점',
      shopDescription: '패브릭 소품 전문 공방입니다.',
      businessProfileId: 11,
      userId: 3,
      instagramId: '@somdaram',
      latitude: 37.5665,
      longitude: 126.978,
      createdAt: '2025.08.28',
      updatedAt: '2025.08.28',
    },
  },
];

const ROLE_STYLE: Record<string, string> = {
  CUSTOMER: 'bg-blue-50 text-blue-600',
  ARTIST: 'bg-purple-50 text-purple-600',
  SHOP: 'bg-emerald-50 text-emerald-600',
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'text-emerald-500',
  INACTIVE: 'text-gray-400',
  SUSPENDED: 'text-red-400',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

type RoleFilter = 'ALL' | 'CUSTOMER' | 'ARTIST' | 'SHOP';

export const AdminMembers = () => {
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(
    null
  );

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchRole = roleFilter === 'ALL' || m.role === roleFilter;
    const matchSearch = m.name.includes(keyword) || m.email.includes(keyword);
    return matchRole && matchSearch;
  });

  const counts = {
    CUSTOMER: MOCK_MEMBERS.filter((m) => m.role === 'CUSTOMER').length,
    ARTIST: MOCK_MEMBERS.filter((m) => m.role === 'ARTIST').length,
    SHOP: MOCK_MEMBERS.filter((m) => m.role === 'SHOP').length,
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { role: 'CUSTOMER', label: 'CUSTOMER', icon: '👤' },
              { role: 'ARTIST', label: 'ARTIST', icon: '🎨' },
              { role: 'SHOP', label: 'SHOP', icon: '🏪' },
            ] as const
          ).map(({ role, label, icon }) => (
            <div
              key={role}
              className="flex items-center gap-3 rounded-xl bg-white px-5 py-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${ROLE_STYLE[role]}`}
              >
                {icon}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">
                  {counts[role].toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 테이블 */}
        <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden rounded-xl bg-white pb-5 pl-6 pr-4 pt-4">
          <header className="shrink-0 border-b pb-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">
                전체 회원 목록{' '}
                <span className="font-normal text-blue-500">
                  {filtered.length}
                </span>
              </h2>
              <div className="mr-1.5 flex items-center gap-2">
                {/* 역할 필터 */}
                <div className="flex gap-1">
                  {(['ALL', 'CUSTOMER', 'ARTIST', 'SHOP'] as RoleFilter[]).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRoleFilter(r)}
                        className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                          roleFilter === r
                            ? 'bg-gray-900 text-white'
                            : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {r === 'ALL' ? '전체' : r}
                      </button>
                    )
                  )}
                </div>
                {/* 검색 */}
                <div className="relative flex items-center">
                  <Search
                    className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    type="text"
                    placeholder="이름, 이메일 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-48 pl-8 text-xs"
                    aria-label="회원 검색"
                  />
                </div>
              </div>
            </div>
          </header>

          <table className="flex min-h-0 w-full flex-1 table-fixed flex-col text-sm">
            <thead className="block w-full shrink-0 [scrollbar-gutter:stable]">
              <tr className="table w-full border-b text-center text-gray-500">
                <th className="w-[18%] py-3 font-normal" scope="col">
                  이름
                </th>
                <th className="w-[28%] py-3 font-normal" scope="col">
                  이메일
                </th>
                <th className="w-[14%] py-3 font-normal" scope="col">
                  역할
                </th>
                <th className="w-[16%] py-3 font-normal" scope="col">
                  가입일
                </th>
                <th className="w-[12%] py-3 font-normal" scope="col">
                  상태
                </th>
                <th className="w-[12%] py-3 font-normal" scope="col">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="block min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
              {filtered.length === 0 ? (
                <tr className="table w-full">
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.userId}
                    className="table w-full table-fixed text-center text-sm transition-colors hover:bg-gray-50"
                  >
                    <td className="w-[18%] py-2.5 text-gray-800">{m.name}</td>
                    <td className="w-[28%] py-2.5 text-gray-500">{m.email}</td>
                    <td className="w-[14%] py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${ROLE_STYLE[m.role]}`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="w-[16%] py-2.5 text-xs text-gray-400">
                      {m.createdAt}
                    </td>
                    <td
                      className={`w-[12%] py-2.5 text-xs ${STATUS_STYLE[m.userStatus]}`}
                    >
                      {STATUS_LABEL[m.userStatus]}
                    </td>
                    <td className="w-[12%] py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedMember(m)}
                          className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                        >
                          열람
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-100 px-2 py-1 text-xs text-red-400 hover:bg-red-50"
                        >
                          탈퇴
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* 모달 */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};
