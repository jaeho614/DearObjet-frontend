import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { type UserRole } from '../../../../shared/constants';
import { Button, Input } from '../../../../shared/components/ui';

import {
  useGetAdminRoleCountsQuery,
  useGetAdminUsersQuery,
} from '../../api/admin-api';
import {
  ROLE_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from '../constants/admin-members-constants';
import { MemberDetailModal } from '../components/member-detail-modal';

type RoleFilter = 'ALL' | UserRole;

export const AdminMembers = () => {
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: roleCounts } = useGetAdminRoleCountsQuery();
  const { data, isLoading, isFetching } = useGetAdminUsersQuery({
    page,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    keyword: keyword || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [roleFilter, keyword]);

  const handleSearch = () => {
    setKeyword(inputValue.trim());
  };

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              role: 'CUSTOMER' as const,
              label: 'CUSTOMER',
              icon: '👤',
              count: roleCounts?.customerCount ?? 0,
            },
            {
              role: 'ARTIST' as const,
              label: 'ARTIST',
              icon: '🎨',
              count: roleCounts?.artistCount ?? 0,
            },
            {
              role: 'SHOP' as const,
              label: 'SHOP',
              icon: '🏪',
              count: roleCounts?.shopCount ?? 0,
            },
          ].map(({ role, label, icon, count }) => (
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
                  {count.toLocaleString()}
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
                  {totalCount.toLocaleString()}
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
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <Search
                      className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      type="text"
                      placeholder="이름, 이메일 검색"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-48 pl-8 text-xs"
                      aria-label="회원 검색"
                    />
                  </div>
                  <Button
                    variant="secondaryLight"
                    size="small"
                    label="검색"
                    onClick={handleSearch}
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
              {isLoading || isFetching ? (
                <tr className="table w-full">
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    불러오는 중...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr className="table w-full">
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((m) => (
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
                      {new Date(m.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td
                      className={`w-[12%] py-2.5 text-xs ${STATUS_STYLE[m.status]}`}
                    >
                      {STATUS_LABEL[m.status]}
                    </td>
                    <td className="w-[12%] py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(m.userId)}
                        className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                      >
                        열람
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex shrink-0 items-center justify-center gap-1 border-t pt-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                이전
              </button>
              <span className="px-3 text-xs text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 모달 */}
      {selectedUserId !== null && (
        <MemberDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
};
