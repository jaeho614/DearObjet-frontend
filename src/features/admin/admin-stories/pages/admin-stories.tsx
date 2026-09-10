import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Search } from 'lucide-react';

import { Button, Input } from '../../../../shared/components/ui';

import type { AdminStoryItem } from '../types/admin-stories-types';
import {
  useDeleteAdminStoryMutation,
  useGetAdminStoriesQuery,
  useUpdateStoryBlindedMutation,
} from '../../api/admin-api';
import {
  CONTENT_STATUS_LABEL,
  CONTENT_STATUS_STYLE,
} from '../constants/admin-stories-constants';
import { AdminStoryDetail } from '../components/admin-story-detail';

export const AdminStories = () => {
  const location = useLocation();
  const initialKeyword =
    (location.state as { searchKeyword?: string } | null)?.searchKeyword ?? '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [inputValue, setInputValue] = useState(initialKeyword);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<AdminStoryItem | null>(null);

  const { data, isLoading, isFetching } = useGetAdminStoriesQuery({
    page,
    keyword: keyword || undefined,
  });
  const [updateStoryBlinded] = useUpdateStoryBlindedMutation();
  const [deleteAdminStory] = useDeleteAdminStoryMutation();

  useEffect(() => {
    setPage(1);
    setSelectedItem(null);
  }, [keyword]);

  const handleSearch = () => {
    setKeyword(inputValue.trim());
  };

  const handleBlind = async () => {
    if (!selectedItem) return;
    if (!confirm(`"${selectedItem.title}"을(를) 블라인드 처리하시겠습니까?`))
      return;
    try {
      await updateStoryBlinded({
        storyId: selectedItem.storyId,
        blinded: true,
      }).unwrap();
      setSelectedItem((prev) => (prev ? { ...prev, blinded: true } : null));
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleUnblind = async () => {
    if (!selectedItem) return;
    try {
      await updateStoryBlinded({
        storyId: selectedItem.storyId,
        blinded: false,
      }).unwrap();
      setSelectedItem((prev) => (prev ? { ...prev, blinded: false } : null));
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    if (!confirm(`"${selectedItem.title}"을(를) 삭제하시겠습니까?`)) return;
    try {
      await deleteAdminStory(selectedItem.storyId).unwrap();
      setSelectedItem(null);
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const items = data?.stories ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* 왼쪽: 목록 */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white">
        <header className="shrink-0 border-b px-4 py-3">
          <h2 className="font-bold">스토리 관리</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            총 {totalCount.toLocaleString()}개
          </p>
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
                placeholder="제목, 공방명 검색..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full pl-8 text-xs"
                aria-label="스토리 검색"
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

        {/* 목록 */}
        <ul className="min-h-0 flex-1 overflow-y-auto" role="list">
          {isLoading || isFetching ? (
            <li className="py-10 text-center text-sm text-gray-400">
              불러오는 중...
            </li>
          ) : items.length === 0 ? (
            <li className="py-10 text-center text-sm text-gray-400">
              검색 결과가 없습니다.
            </li>
          ) : (
            items.map((item) => (
              <li key={item.storyId}>
                <button
                  type="button"
                  className={`w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                    selectedItem?.storyId === item.storyId
                      ? 'border-l-2 border-l-gray-900 bg-gray-50'
                      : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        item.blinded
                          ? CONTENT_STATUS_STYLE.BLIND
                          : CONTENT_STATUS_STYLE.VISIBLE
                      }`}
                    >
                      {item.blinded
                        ? CONTENT_STATUS_LABEL.BLIND
                        : CONTENT_STATUS_LABEL.VISIBLE}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {item.userName}{' '}
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
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

      {/* 오른쪽: 상세 */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white">
        {selectedItem === null ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            항목을 선택해주세요.
          </div>
        ) : (
          <AdminStoryDetail
            key={selectedItem.storyId}
            storyId={selectedItem.storyId}
            isBlinded={selectedItem.blinded}
            onBlind={handleBlind}
            onUnblind={handleUnblind}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
};
