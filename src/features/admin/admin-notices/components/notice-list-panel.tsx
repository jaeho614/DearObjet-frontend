import { Search, Plus } from 'lucide-react';

import { Button, Input } from '../../../../shared/components/ui';

import {
  TARGET_LABEL,
  TARGET_STYLE,
  CATEGORY_LABEL,
  STATUS_LABEL,
  STATUS_STYLE,
} from '../constants/admin-notices-constants';
import type {
  NoticeListPanelProps,
  TabFilter,
} from '../types/admin-notices-types';

export const NoticeListPanel = ({
  items,
  isLoading,
  isFetching,
  selectedNoticeId,
  tabFilter,
  inputValue,
  page,
  totalPages,
  onSelectNotice,
  onTabChange,
  onInputChange,
  onSearch,
  onNew,
  onPageChange,
}: NoticeListPanelProps) => {
  return (
    <section className="flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
      <header className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">공지사항</h2>
          <button
            type="button"
            onClick={onNew}
            className="flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-700"
          >
            <Plus size={12} aria-hidden="true" />새 공지
          </button>
        </div>
      </header>

      {/* 검색 */}
      <div className="shrink-0 border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative flex flex-1 items-center">
            <Search
              className="absolute left-2.5 h-3.5 w-3.5 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="공지 검색..."
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full pl-8 text-xs"
              aria-label="공지 검색"
            />
          </div>
          <Button
            variant="secondaryLight"
            size="small"
            label="검색"
            onClick={onSearch}
          />
        </div>
      </div>

      {/* 탭 필터 */}
      <div className="flex shrink-0 gap-1 border-b px-4 py-2">
        {(['ALL', 'USER', 'ARTIST_SHOP'] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              tabFilter === tab
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            {tab === 'ALL' ? '전체' : tab === 'USER' ? '메인' : '파트너'}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <ul className="min-h-0 flex-1 overflow-y-auto" role="list">
        {isLoading || isFetching ? (
          <li className="py-10 text-center text-sm text-gray-400">
            불러오는 중...
          </li>
        ) : items.length === 0 ? (
          <li className="py-10 text-center text-sm text-gray-400">
            공지사항이 없습니다.
          </li>
        ) : (
          items.map((notice) => (
            <li key={notice.noticeId}>
              <button
                type="button"
                className={`w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                  selectedNoticeId === notice.noticeId
                    ? 'border-l-2 border-l-gray-900 bg-gray-50'
                    : ''
                }`}
                onClick={() => onSelectNotice(notice)}
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${TARGET_STYLE[notice.target]}`}
                  >
                    {TARGET_LABEL[notice.target]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[notice.status]}`}
                  >
                    {STATUS_LABEL[notice.status]}
                  </span>
                  {notice.pinned && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      고정
                    </span>
                  )}
                </div>
                <p className="truncate text-xs font-medium text-gray-800">
                  {notice.title}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {CATEGORY_LABEL[notice.category]} ·{' '}
                  {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-1 border-t px-4 py-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
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
            onClick={() => onPageChange(page + 1)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
};
