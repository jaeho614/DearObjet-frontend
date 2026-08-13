import { useState } from 'react';

import { useGetAdminNoticesQuery } from '../../api/admin-api';
import { NoticeListPanel } from '../components/notice-list-panel';
import { NoticeDetailPanel } from '../components/notice-detail-panel';
import { NoticeCreatePanel } from '../components/notice-create-panel';
import type { NoticeItem, TabFilter } from '../types/admin-notices-types';

export const AdminNotices = () => {
  const [tabFilter, setTabFilter] = useState<TabFilter>('ALL');
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, isFetching } = useGetAdminNoticesQuery({
    target: tabFilter === 'ALL' ? undefined : tabFilter,
    keyword: keyword || undefined,
    page,
    size: 10,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = () => {
    setKeyword(inputValue.trim());
    setPage(1);
    setSelectedNoticeId(null);
  };

  const handleSelectNotice = (notice: NoticeItem) => {
    setSelectedNoticeId(notice.noticeId);
    setIsCreating(false);
  };

  const handleTabChange = (tab: TabFilter) => {
    setTabFilter(tab);
    setPage(1);
    setSelectedNoticeId(null);
  };

  const handleNew = () => {
    setIsCreating(true);
    setSelectedNoticeId(null);
  };

  const handleCreateCancel = () => setIsCreating(false);

  const handleDeleted = () => setSelectedNoticeId(null);

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <NoticeListPanel
        items={items}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedNoticeId={selectedNoticeId}
        tabFilter={tabFilter}
        inputValue={inputValue}
        page={page}
        totalPages={totalPages}
        onSelectNotice={handleSelectNotice}
        onTabChange={handleTabChange}
        onInputChange={setInputValue}
        onSearch={handleSearch}
        onNew={handleNew}
        onPageChange={setPage}
      />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
        {isCreating ? (
          <NoticeCreatePanel onCancel={handleCreateCancel} />
        ) : selectedNoticeId !== null ? (
          <NoticeDetailPanel
            key={selectedNoticeId}
            noticeId={selectedNoticeId}
            onDeleted={handleDeleted}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            공지를 선택해주세요.
          </div>
        )}
      </section>
    </div>
  );
};
